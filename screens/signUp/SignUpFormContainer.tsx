import { Formik, FormikProps } from 'formik';
import React, {FC, useRef} from 'react';
import firebase from '@react-native-firebase/app';
import * as Yup from 'yup';

import { i18n } from '../../locale';
import { Route } from '../../navigation';
import { FirebaseService, NavigationService } from '../../services';

import { SignUpForm } from './SignUpForm';

export interface SignUpFormData {
  email: string;
  password: string;
  name: string;
  imageUrl: string;
}

const initialValues = {
  email: '',
  password: '',
  name: '',
  imageUrl: '',
  termsAccepted: false,
};

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email(i18n.t('validation:email'))
    .required(i18n.t('validation:required')),
  password: Yup.string()
    .min(6, i18n.t('validation:passwordLength'))
    .required(i18n.t('validation:required')),
  name: Yup.string().required(i18n.t('validation:required')),
});

interface State {
  loading: boolean;
}

export const SignUpFormContainer: FC<{}> = () => {
  const loading = useRef(false)

  const renderForm = (props: FormikProps<SignUpFormData>) => <SignUpForm {...props} loading={loading.current} />;
  
  const onSubmit = async (values: SignUpFormData) => {
    loading.current = true
    try {
      // const userCredentials = await firebase.auth().createUserWithEmailAndPassword(values.email, values.password);
      // if (userCredentials.user) {
      //   userCredentials.user.updateProfile({ displayName: values.name });

      //   if (values.imageUrl) {
      //     await FirebaseService.updateUserImage(values.imageUrl);
      //   }
      // }
      NavigationService.navigate(Route.Authenticated);
    } catch (error: any) {
      loading.current = false
      NavigationService.navigate(Route.Dialog, {
        title: i18n.t('common:error'),
        description: error.message,
      });
    }
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {(props: FormikProps<SignUpFormData>): React.ReactNode => (
        <SignUpForm {...props} loading={loading.current} />
      )}
    </Formik>
  );

}
