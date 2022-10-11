import { Modal } from 'antd'

const OrderModal = ({ session, orderedBy, showModal, setShowModal }) => {
    return (
        <Modal
            open={showModal}
            title="Order payment info"
            onCancel={() => setShowModal(!showModal)}
        >
            <p>Customer: {orderedBy.name}</p>
            <p>Stripe payment method: {session.payment_method_types[0]}</p>
            <p>
                Amount total: {session.currency.toUpperCase()}{" "}
                £{session.amount_total / 100}
            </p>
            <p>Payment intent: {session.payment_intent}</p>
            <p>Payment status: {session.payment_status}</p>
        </Modal>
    )
}

export default OrderModal