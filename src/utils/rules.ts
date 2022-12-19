import * as yup from 'yup'

const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/
const urlRegExp =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm

export const getAllRules = () => {
  const isRequired = yup.string().required('Vui lòng nhập trường này')
  const email = yup.string().email('Sai định dạng email').required('Vui lòng nhập email')
  const fullName = yup.string().required('Tên không được để trống')
  const password = yup.string().min(6, 'Mật khẩu tối thiểu 6 ký tự').required('Mật khẩu không được để trống')
  const phoneNumber = yup
    .string()
    .required('Số điện thoại không được để trống')
    .matches(phoneRegExp, 'Sai định dạng số điện thoại')
  const url = yup.string().matches(urlRegExp, 'Sai định dạng url')
  const otp = yup.number().required('Vui lòng nhập mã OTP')

  return { isRequired, email, password, fullName, phoneNumber, url, otp }
}
