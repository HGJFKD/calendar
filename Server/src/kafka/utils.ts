import { Producer } from "kafkajs";

const sendKafkaMessage = async (producer: Producer, topic: string, message: string) => {
    try {
        await producer.connect();
        await producer.send({ topic, messages: [{ value: message }] });
        await producer.disconnect();
    } catch (error) {
        return Promise.reject(error);
    }
};

export default sendKafkaMessage