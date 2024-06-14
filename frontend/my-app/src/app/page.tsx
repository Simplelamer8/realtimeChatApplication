"use client"
import axios from "axios";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Formik
       initialValues={{ email: '', password: '' }}
       validate={values => {
         const errors:{email: string} = {email: ""};
         if (!values.email) {
           errors.email = 'Required';
         } else if (
           !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
         ) {
           errors.email = 'Invalid email address';
         }
         console.log(errors);
         if(errors.email === "")
        {
          return {};
        }
         return errors;
       }}
       onSubmit={async (values, { setSubmitting }) => {
          const response = await axios.post("http://localhost:5000/api/login", {email: values.email, password: values.password});
          localStorage.setItem("userData", JSON.stringify(response.data));
          console.log(response);
          router.push("/chats");
       }}
     >
       {({ isSubmitting }) => (
         <Form className="flex flex-col">
           <Field type="email" name="email" placeholder="Email" />
           <ErrorMessage name="email" component="div" />
           <Field type="password" name="password" className="mt-5" placeholder="Password" />
           <ErrorMessage name="password" component="div" />
           <button type="submit" disabled={isSubmitting} className="mt-5">
             Submit
           </button>
         </Form>
       )}
     </Formik>
    </main>
  );
}
