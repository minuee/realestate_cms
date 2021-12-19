import dayjs from "dayjs";
import CryptoJS from "crypto-js";
import { IMAGE_BASE_URL } from "env";

const appID = "goodagents";
const CommonSaltKey = "goodagenteda40baa4fHynnm4W1";

const key_hash = CryptoJS.MD5(appID);
const hashkey = CryptoJS.enc.Utf8.parse(key_hash);
const hashiv = CryptoJS.enc.Utf8.parse(CommonSaltKey);

export function encrypt(str) {
  if (!str) return str;

  let encrypted = CryptoJS.AES.encrypt(str, hashkey, { iv: hashiv, mode: CryptoJS.mode.CBC });
  return encrypted.toString();
}
export function decrypt(str) {
  if (!str) return str;

  try {
    let decrypted = CryptoJS.AES.decrypt(str, hashkey, { iv: hashiv, mode: CryptoJS.mode.CBC });
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.log({ e });
    return str;
  }
}

export function thousandSeparator(num) {
  let tmp = parseInt(num);

  if (Number.isNaN(tmp)) {
    return null;
  } else {
    return tmp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}

export function getFullImgURL(relative_path) {
  if (!relative_path) {
    return null;
  } else {
    return IMAGE_BASE_URL + relative_path;
  }
}

export function listIndex(total, page, idx) {
  let tmp = +total - (+page - 1) * 10 - +idx;
  return tmp;
}

export function randInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export function dateFormat(timestamp, type) {
  if (timestamp) {
    return dayjs.unix(timestamp).format("YYYY-MM-DD HH:mm:ss");
  } else {
    if (type == "s") {
      return dayjs()
        .subtract(1, "M")
        .format("YYYY-MM-DD HH:mm:ss");
    } else {
      return dayjs().format("YYYY-MM-DD HH:mm:ss");
    }
  }
}

export function divByBillion(num) {
  if (!+num) return 0;
  else {
    return (num / 100_000_000).toFixed(1);
  }
}
