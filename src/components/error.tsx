interface ErrorMsg {
  message: string;
}
const ErrorMessage = ({ message }: ErrorMsg) => {
  return <span className="text-sm text-red-400">{message}</span>;
};

export default ErrorMessage;
