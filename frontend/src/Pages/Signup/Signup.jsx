import React, { useState } from "react";
import styles from "./Signup.module.css";
import TextInput from "../../components/TextInput/TextInput";
import signupSchema from "../../schemas/signupSchema";
import { useFormik } from "formik";
import { signup } from "../../api/internal";
import { setUser } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const handleSignup = async () => {
    const data = {
      name: values.name,
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
    };

    const response = await signup(data);

    if (response.status === 201) {
      // 1. setUser
      const user = {
        _id: response.data.user._id,
        email: response.data.user.email,
        username: response.data.user.username,
        auth: response.data.auth,
      };

      dispatch(setUser(user));

      navigate("/");
    } else if (response.code === "ERR_BAD_REQUEST") {
      // display error message
      setError(response.response.data.message);
    }
  };

  const { values, touched, handleBlur, handleChange, errors } = useFormik({
    initialValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },

    validationSchema: signupSchema,
  });

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupHeader}>Create your account</div>
      <TextInput
        type="text"
        value={values.name}
        name="name"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="name"
        error={errors.name && touched.name ? 1 : undefined}
        errormessage={errors.name}
      />
      <TextInput
        type="text"
        value={values.username}
        name="username"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="username"
        error={errors.username && touched.username ? 1 : undefined}
        errormessage={errors.username}
      />
      <TextInput
        type="email"
        value={values.email}
        name="email"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="email"
        error={errors.email && touched.email ? 1 : undefined}
        errormessage={errors.email}
      />
      <TextInput
        type="password"
        value={values.password}
        name="password"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="password"
        error={errors.password && touched.password ? 1 : undefined}
        errormessage={errors.password}
      />
      <TextInput
        type="password"
        value={values.confirmPassword}
        name="confirmPassword"
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder="confirm Password"
        error={
          errors.confirmPassword && touched.confirmPassword ? 1 : undefined
        }
        errormessage={errors.confirmPassword}
      />
      <button
        className={styles.signupButton}
        onClick={handleSignup}
        disabled={
          !values.name ||
          !values.username ||
          !values.email ||
          !values.password ||
          !values.confirmPassword ||
          errors.name ||
          errors.username ||
          errors.email ||
          errors.password ||
          errors.confirmPassword
        }
      >
        Sign up
      </button>
      <span>
        Already have an account?{" "}
        <button
          className={styles.createAccount}
          onClick={() => navigate("/login")}
        >
          login
        </button>
      </span>
      {error !== "" ? <p className={styles.errorMessage}>{error}</p> : ""}
    </div>
  );
};

export default Signup;
