import { Order, Product } from './model';

const orderDAO = {

  // 총 결제액 계산 함수
  calculatePayments(orderInfo) {
    const initialValue = 0;
    const { products, deliveryCharge } = orderInfo;

    const productsPayment = products.reduce(
      (acc, product) => acc + (product.quantity * product.price),
      initialValue,
    );

    const totalPayment = productsPayment + deliveryCharge;
    return { productsPayment, totalPayment };
  },

  // 주문 저장하기
  async createOrder(orderInfo) {
    // 가장 마지막에 등록된 주문의 orderId + 1 해서 새 주문의 orderId 로 사용한다.
    const lastOrder = await Order.find({}).sort({ createdAt: -1 }).limit(1);
    const lastOrderId = lastOrder.length === 0 ? 0 : lastOrder[0].orderId;
    const nextOrderId = lastOrderId + 1;

    // 총 상품 금액과 총 주문 금액 계산하기
    const { productsPayment, totalPayment } = this.calculatePayments(orderInfo);

    // 주문 등록하기
    await Order.create({
      ...orderInfo, orderId: nextOrderId, productsPayment, totalPayment,
    });

    // TODO : 주문을 저장 후, [해당 productId의 상품 수량]에서 [주문 수량]만큼 차감해야 한다.
    // !!따로 함수로 분리하기!!
    // const { productId, quantity: orderedQuantity } = orderInfo;

    // const product = await Product.findOne({ productId });
    // const currentProductQuantity = product.quantity;

    // await Product.updateOne({ productId }, { quantity: currentProductQuantity - orderedQuantity });

    // TODO : 완료된 주문 정보를 다시 전달
    const createdOrder = await Order.findOne({ orderId: nextOrderId });
    return createdOrder;
  },

  // 모든 주문 정보 조회하기
  async getAllOrders() {
    const orders = await Order.find({});

    return orders;
  },

  // 특정 유저의 모든 주문 정보 조회하기
  async getOrdersByUserId(ordererEmail) {
    const orders = await Order.find({ 'orderer.email': ordererEmail });

    return orders;
  },

  // 특정 orderId 에 해당하는 주문 정보 조회하기
  async getOrderByOrderId(orderId) {
    const order = await Order.findOne({ orderId });

    return order;
  },

};

export { orderDAO };
