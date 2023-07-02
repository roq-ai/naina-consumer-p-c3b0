import * as yup from 'yup';

export const inquiryValidationSchema = yup.object().shape({
  question: yup.string().required(),
  response: yup.string(),
  customer_service_representative_id: yup.string().nullable(),
  organization_id: yup.string().nullable(),
});
