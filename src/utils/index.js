// import Base58 from 'base-58'
import sha256 from 'js-sha256'

const checkKeeper = () => {
	return typeof window.Waves !== 'undefined';
}

export default {
	sha256
}
