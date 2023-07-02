import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getInquiryById, updateInquiryById } from 'apiSdk/inquiries';
import { Error } from 'components/error';
import { inquiryValidationSchema } from 'validationSchema/inquiries';
import { InquiryInterface } from 'interfaces/inquiry';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { OrganizationInterface } from 'interfaces/organization';
import { getUsers } from 'apiSdk/users';
import { getOrganizations } from 'apiSdk/organizations';

function InquiryEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<InquiryInterface>(
    () => (id ? `/inquiries/${id}` : null),
    () => getInquiryById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: InquiryInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateInquiryById(id, values);
      mutate(updated);
      resetForm();
      router.push('/inquiries');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<InquiryInterface>({
    initialValues: data,
    validationSchema: inquiryValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Inquiry
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="question" mb="4" isInvalid={!!formik.errors?.question}>
              <FormLabel>Question</FormLabel>
              <Input type="text" name="question" value={formik.values?.question} onChange={formik.handleChange} />
              {formik.errors.question && <FormErrorMessage>{formik.errors?.question}</FormErrorMessage>}
            </FormControl>
            <FormControl id="response" mb="4" isInvalid={!!formik.errors?.response}>
              <FormLabel>Response</FormLabel>
              <Input type="text" name="response" value={formik.values?.response} onChange={formik.handleChange} />
              {formik.errors.response && <FormErrorMessage>{formik.errors?.response}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<UserInterface>
              formik={formik}
              name={'customer_service_representative_id'}
              label={'Select User'}
              placeholder={'Select User'}
              fetcher={getUsers}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.email}
                </option>
              )}
            />
            <AsyncSelect<OrganizationInterface>
              formik={formik}
              name={'organization_id'}
              label={'Select Organization'}
              placeholder={'Select Organization'}
              fetcher={getOrganizations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'inquiry',
    operation: AccessOperationEnum.UPDATE,
  }),
)(InquiryEditPage);
