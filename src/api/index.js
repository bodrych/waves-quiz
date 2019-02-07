import axios from 'axios';

const loadPosts = async (node, wall, limit) => {
	let response = await axios.get(`${node}/transactions/address/${wall}/limit/${limit}`);
	return response.data;
}

const getBalance = async (node, address) => {
	let response = await axios.get(`${node}/addresses/balance/${address}`);
	return response.data.balance;
}

const getHeight = async (node) => {
	let response = await axios.get(`${node}/blocks/height`);
	return response.data.height;
}

const getPrice = async (node, address) => {
	let response = await axios.get(`${node}/addresses/data/${address}/price`);
	return response.data.value;
}

const getStartHeight = async (node, address) => {
	let response = await axios.get(`${node}/addresses/data/${address}/height`);
	return response.data.value;
}

export default {
	getBalance,
	getHeight,
	getStartHeight,
	getPrice
}
