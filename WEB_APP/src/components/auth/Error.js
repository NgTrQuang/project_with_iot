import { Link } from "react-router-dom";

const Error = () => {
    return (
        <div className="flex items-center p-4 bg-red-100 border border-green-400 rounded-lg">
            {/* <CheckCircleIcon className="w-16 h-16 text-green-500 mr-4" /> */}
            <div className="flex-1">
                <h5 className="text-lg font-bold text-red-700">Chúng tôi rất tiếc bạn đã đăng ký thất bại.</h5>
                <p className="text-gray-600">Vui lòng kiểm tra lại các bước đăng ký!</p>
            </div>
            <Link to={'/'}>
                <button variant="contained" color="secondary" className="mt-2 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                    Tiếp tục
                </button>
            </Link>
        </div>
    );
}
export default Error;
