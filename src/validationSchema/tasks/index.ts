import * as yup from 'yup';

export const taskValidationSchema = yup.object().shape({
  description: yup.string().required(),
  status: yup.string().required(),
  team_member_id: yup.string().nullable(),
  organization_id: yup.string().nullable(),
});
