import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";
import Time "mo:core/Time";

actor {
  type GheeProduct = {
    name : Text;
    description : Text;
    pricePaise : Nat; // Price in paise (1 INR = 100 paise)
    availableStock : Nat;
  };

  type OrderStatus = {
    #pending;
    #paid;
    #shipped;
    #delivered;
  };

  type Order = {
    id : Nat;
    customerName : Text;
    customerEmail : Text;
    address : Text;
    quantity : Nat;
    totalAmountPaise : Nat;
    status : OrderStatus;
    createdAt : Int;
    paymentId : ?Text;
  };

  module OrderModule {
    public func compare(order1 : Order, order2 : Order) : Order.Order {
      Nat.compare(order1.id, order2.id);
    };
  };

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  var product : GheeProduct = {
    name = "Dhansu Ghee";
    description = "Pure, homemade ghee from grassfed cows in Bihar. Filtration, fermentation, fermentation. Organic goodness.";
    pricePaise = 120000; // 1200 INR
    availableStock = 100;
  };

  var nextOrderId = 1;
  let orders = Map.empty<Nat, Order>();

  public query ({ caller }) func getProduct() : async GheeProduct {
    // Public access - no authorization needed
    product;
  };

  public shared ({ caller }) func updateProduct(updatedProduct : GheeProduct) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update the product");
    };
    product := updatedProduct;
  };

  public shared ({ caller }) func placeOrder(customerName : Text, customerEmail : Text, address : Text, quantity : Nat) : async Nat {
    // Public access - guests can place orders
    if (quantity == 0) {
      Runtime.trap("Quantity must be greater than 0");
    };
    if (quantity > product.availableStock) {
      Runtime.trap("Not enough stock available");
    };

    let orderId = nextOrderId;
    nextOrderId += 1;

    let newOrder : Order = {
      id = orderId;
      customerName;
      customerEmail;
      address;
      quantity;
      totalAmountPaise = quantity * product.pricePaise;
      status = #pending;
      createdAt = Time.now();
      paymentId = null;
    };

    orders.add(orderId, newOrder);
    product := {
      product with availableStock = product.availableStock - quantity
    };

    orderId;
  };

  public shared ({ caller }) func updateOrderStatus(orderId : Nat, newStatus : OrderStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        let updatedOrder = {
          order with status = newStatus
        };
        orders.add(orderId, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrder(orderId : Nat) : async Order {
    // Require authentication - only authenticated users or admins can view orders
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view orders");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { 
        // Additional check: non-admin users can only view orders matching their profile email
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          switch (userProfiles.get(caller)) {
            case (null) { Runtime.trap("Unauthorized: User profile not found") };
            case (?profile) {
              if (profile.email != order.customerEmail) {
                Runtime.trap("Unauthorized: Can only view your own orders");
              };
            };
          };
        };
        order;
      };
    };
  };

  public query ({ caller }) func getCustomerOrders(email : Text) : async [Order] {
    // Require authentication - only authenticated users can view order history
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view order history");
    };

    // Non-admin users can only view their own orders
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      switch (userProfiles.get(caller)) {
        case (null) { Runtime.trap("Unauthorized: User profile not found") };
        case (?profile) {
          if (profile.email != email) {
            Runtime.trap("Unauthorized: Can only view your own order history");
          };
        };
      };
    };

    orders.values().toArray().filter<Order>(
      func(o : Order) : Bool { o.customerEmail == email }
    );
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray().sort<Order>();
  };

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?config) { config };
    };
  };

  public query ({ caller }) func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    // Require authentication for payment operations
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };

    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public shared ({ caller }) func createStripeCheckout(orderId : Nat, successUrl : Text, cancelUrl : Text) : async Text {
    // Require authentication for payment operations
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };

    switch (orders.get(orderId)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Non-admin users can only create checkout for their own orders
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          switch (userProfiles.get(caller)) {
            case (null) { Runtime.trap("Unauthorized: User profile not found") };
            case (?profile) {
              if (profile.email != order.customerEmail) {
                Runtime.trap("Unauthorized: Can only create checkout for your own orders");
              };
            };
          };
        };

        let stripeItem : Stripe.ShoppingItem = {
          productName = product.name;
          productDescription = product.description;
          priceInCents = order.totalAmountPaise / 100;
          quantity = order.quantity;
          currency = "INR";
        };

        await Stripe.createCheckoutSession(getStripeConfiguration(), caller, [stripeItem], successUrl, cancelUrl, transform);
      };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    // Require authentication for payment status checks
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check session status");
    };

    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    // Transform function for HTTP outcalls - no authorization needed
    OutCall.transform(input);
  };
};
