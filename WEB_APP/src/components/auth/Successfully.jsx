import { Link } from "react-router-dom";

const Successfully = () => {
    return (
        <div className="flex items-center p-4 bg-green-100 border border-green-400 rounded-lg">
            {/* <CheckCircleIcon className="w-16 h-16 text-green-500 mr-4" /> */}
            <div className="flex-1">
                <h5 className="text-lg font-bold text-green-700">Bạn đã đăng ký thành công.</h5>
                <p className="text-gray-600">Vui lòng check email để lấy mật khẩu đăng nhập!</p>
            </div>
            <Link to={'/'}>
                <button variant="contained" color="primary" className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Tiếp tục
                </button>
            </Link>
        </div>
    );
}
export default Successfully;
