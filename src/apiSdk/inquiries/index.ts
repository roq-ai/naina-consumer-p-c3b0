import axios from 'axios';
import queryString from 'query-string';
import { InquiryInterface, InquiryGetQueryInterface } from 'interfaces/inquiry';
import { GetQueryInterface } from '../../interfaces';

export const getInquiries = async (query?: InquiryGetQueryInterface) => {
  const response = await axios.get(`/api/inquiries${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createInquiry = async (inquiry: InquiryInterface) => {
  const response = await axios.post('/api/inquiries', inquiry);
  return response.data;
};

export const updateInquiryById = async (id: string, inquiry: InquiryInterface) => {
  const response = await axios.put(`/api/inquiries/${id}`, inquiry);
  return response.data;
};

export const getInquiryById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/inquiries/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteInquiryById = async (id: string) => {
  const response = await axios.delete(`/api/inquiries/${id}`);
  return response.data;
};
