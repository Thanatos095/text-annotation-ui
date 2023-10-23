import { z } from 'zod';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { useContext, useState }  from 'react';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from "../../api";
import { userContext, userContextType } from '@/context';

const Schema = z.object({
    email: z.string().email(),
    name: z.string(),
    password: z.string().min(4),
    confirmPassword: z.string().min(4),
});

const Authentication = () => {
    const [isRegister, setIsRegister] = useState<Boolean>(false);
    const {login} = useContext(userContext) as userContextType;
    const navigate = useNavigate();


    const formik = useFormik({
        initialValues: {
              name: '',
              email: '',
              password: '',
              confirmPassword: ''
          },
          validationSchema: toFormikValidationSchema(Schema),
          onSubmit: (values) => {
            console.log(values);
          },
      });

    const SignUp = () => 
    {
          formik.handleSubmit();
          User.register({
            body: {
                name: formik.values.name, 
                password: formik.values.password, 
                email: formik.values.email,  
            }
          }).then(({status, body}) => {
            if (status == 201) {
                login({
                    name: body.name,
                    email: body.email,
                    role: body.role,
                    token: body.token,
                })
            }
            navigate("/");
          })
    };
  
    const SignIn = () =>
    {
        formik.handleSubmit();
        User.login({
            body: {
                email: formik.values.email,
                password: formik.values.password
            }
        }).then(({status, body}) => {
            console.log("body",body)
            if (status == 200) {
                login({
                    name: body.name,
                    email: body.email,
                    role: body.role,
                    token: body.token,
                })
            }
            navigate("/");
         })
    };
  

    return ( 
        <div className="bg-gray-100 flex h-[calc(100vh-120px)] sm:h-[calc(100vh-70px)]">
            <Card className='bg-white shadow-md rounded w-120 m-auto'>
                <CardHeader className="space-y-1">
                    { isRegister ? 
                    <>
                        <CardTitle className="text-2xl">Create an account</CardTitle>
                        <CardDescription>
                                Enter your details below to create your account
                        </CardDescription>
                    </>
                    :
                    <>
                        <CardTitle className="text-2xl">Login to your account</CardTitle>
                        <CardDescription>
                                Enter your credentials to login to your account
                        </CardDescription>
                    </>
                    }
                </CardHeader>
                <CardContent>
                    <div className='mb-4'>  
                        {
                            isRegister &&
                                <>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Name
                                    </label>
                                    <input
                                        className='shadow w-full border rounded px-2 py-2 appearance-none'
                                        {...formik.getFieldProps('name')}
                                        id="name"
                                        name="name"
                                    /> 
                                </>
                        }
                    </div>
                    <div className='mb-4'> 
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Email
                        </label>
                        <input
                            className='px-2 shadow w-full border rounded py-2 appearance-none'
                            {...formik.getFieldProps('email')}
                            type="email"
                            id="email"
                            name="email"
                        /> 
                    </div>
                    <div className='mb-4'> 
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Password
                        </label>
                            <input
                                    className='px-2 shadow w-full border rounded py-2 appearance-none'
                                    {...formik.getFieldProps('password')}
                                    id="password"
                                    name="password"
                            /> 
                    </div>
                    <div className=''>  
                        {
                            isRegister &&
                                <>
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Confirm Password
                                    </label>
                                    <input
                                        className='px-2 shadow w-full border rounded py-2 appearance-none'
                                        {...formik.getFieldProps('confirmPassword')}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                    /> 
                                </>
                        }
                    </div>
                </CardContent>
                <CardFooter className='block'>
                        <Button onClick={isRegister ? SignUp : SignIn} className = "w-full" type="button">
                            {isRegister ? "Sign Up" : "Sign In"}
                        </Button>
                        <div className='mt-6'>
                            <button onClick={() => {setIsRegister(!isRegister)}} className='text-gray-500'>{isRegister ? "Existing user?" : "Don't have an account?"}</button>                  
                        </div>
                </CardFooter>
            </Card>
        </div>
     );
}
 
export default Authentication;