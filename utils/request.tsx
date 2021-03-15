import axios from "axios";

const headers = {
  headers: {
    "Content-Type": "application/json",
  },
};

export const GET = async (url: string, params: object) => {
  if (params) {
    url += getParams(params);
  }
  try {
    const resp = await axios.get(url, headers);
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

export const POST = async (url: string, body: object, params: object) => {
  if (params) {
    url += getParams(params);
  }
  try {
    const resp = await axios.post(url, body, headers);
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

export const PUT = async (url: string, body: object, params: object) => {
  if (params) {
    url += getParams(params);
  }
  try {
    const resp = await axios.put(url, body, headers);
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

export const DELETE = async (url: string, params: object) => {
  if (params) {
    url += getParams(params);
  }
  try {
    const resp = await axios.delete(url);
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

export const POSTFILE = async (url: string, formData: any, params: object) => {
  if (params) {
    url += getParams(params);
  }
  try {
    const resp = await axios.post(url, formData);
    return resp.data;
  } catch (error) {
    return handleError(error);
  }
};

const getParams = (params: object) => {
  let paramsUrl = "?";
  try {
    for (const key of Object.keys(params)) {
      paramsUrl += key + "=" + params[key] + "&";
    }
    return paramsUrl.slice(0, -1);
  } catch (error) {
    console.error(error);
    return "";
  }
};

const handleError = (error) => {
  console.log("=== error ===", error);
};
