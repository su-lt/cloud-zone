import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { formattedPrice } from "../../helpers/ultil";
import {
    clearState,
    fetchOrdersByUserId,
    fetchProfile,
    handleOnChangeInfo,
    handleOnChangePass,
    updateInfo,
    updatePass,
} from "../../redux/slices/profile.slice";
import { toast } from "react-toastify";
import Breadcrumb from "../../components/Breadcrumb";

const breadcrumbItems = [
    { label: "Home", link: "/" },
    { label: "Profile", link: "" },
];

const Profile = () => {
    const dispatch = useDispatch();
    // redux state
    // auth
    const { id } = useSelector((slice) => slice.auth);
    // profile
    const {
        user,
        orders,
        updateObjInfo,
        updateObjPass,
        updateInfoCompleted,
        updatePassCompleted,
        error,
        errors,
    } = useSelector((slice) => slice.profile);
    // useState
    const [openUpdateInfo, setUpdateInfo] = useState(false);
    const [openUpdatePass, setUpdatePass] = useState(false);

    // handle update info
    const handleUpdateInfo = () => {
        dispatch(updateInfo({ id, ...updateObjInfo }));
    };
    // handle update info
    const handleUpdatePass = () => {
        dispatch(updatePass({ id, ...updateObjPass }));
    };

    useEffect(() => {
        // update info successfully
        if (updateInfoCompleted) {
            toast.success("Update info successfully !");
            dispatch(clearState());
            setUpdateInfo(false);
        }
        // update pass successfully
        if (updatePassCompleted) {
            toast.success("Update pass successfully !");
            dispatch(clearState());
            setUpdatePass(false);
        }
        // update fail
        if (error) {
            toast.warning("Update fail, please try again !");
            dispatch(clearState());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateInfoCompleted, updatePassCompleted, error]);

    // fetch profile
    useEffect(() => {
        if (id) {
            dispatch(fetchProfile(id));
            dispatch(fetchOrdersByUserId(id));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // cleanup
    useEffect(() => {
        return () => {
            dispatch(clearState());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <main className="dark:bg-dark dark:text-custom-1000 min-h-[calc(100vh-329px)]">
            <div className="p-4 md:pt-16 md:container">
                <Breadcrumb items={breadcrumbItems} />
                {!user && (
                    <div className="w-full text-center">
                        <p>Oops, somethings wrong !!! </p>
                        <div className="">Please try again later</div>
                    </div>
                )}
                {/* profile */}
                {user && (
                    <div className="mt-4 p-4 border border-custom-1000 rounded-lg">
                        <h3 className="mb-4">Personal information</h3>
                        <div className="mt-4 flex justify-between sm:justify-start sm:gap-16">
                            <button
                                onClick={() => setUpdateInfo((pre) => !pre)}
                                className="text-sky-300"
                            >
                                Update info
                            </button>
                            {openUpdateInfo && (
                                <button
                                    onClick={handleUpdateInfo}
                                    className="text-sky-300"
                                >
                                    Save
                                </button>
                            )}
                        </div>
                        <div className="mt-1 flex items-center">
                            <h4 className="w-[160px] text-sm sm:text-lg">
                                Fullname
                            </h4>
                            <div className="max-w-lg w-full">
                                <input
                                    type="text"
                                    disabled={openUpdateInfo ? false : true}
                                    value={updateObjInfo.fullname}
                                    onChange={(e) =>
                                        dispatch(
                                            handleOnChangeInfo({
                                                field: "fullname",
                                                value: e.target.value,
                                            })
                                        )
                                    }
                                    className={`w-full p-2 border border-custom-500 rounded-sm ${
                                        errors.fullname && "border-red-400"
                                    }`}
                                />
                                {errors.fullname && (
                                    <span className="text-xs text-red-500">
                                        * {errors.fullname}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-1 flex items-center">
                            <h4 className="w-[160px] text-sm sm:text-lg">
                                Email
                            </h4>
                            <div className="max-w-lg w-full">
                                <input
                                    type="text"
                                    disabled={openUpdateInfo ? false : true}
                                    value={updateObjInfo.email}
                                    onChange={(e) =>
                                        dispatch(
                                            handleOnChangeInfo({
                                                field: "email",
                                                value: e.target.value,
                                            })
                                        )
                                    }
                                    className={`w-full p-2 border border-custom-500 rounded-sm ${
                                        errors.email && "border-red-400"
                                    }`}
                                />
                                {errors.email && (
                                    <span className="text-xs text-red-500">
                                        * {errors.email}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-1 flex items-center">
                            <h4 className="w-[160px] text-sm sm:text-lg">
                                Phone
                            </h4>
                            <div className="max-w-lg w-full">
                                <input
                                    type="text"
                                    disabled={openUpdateInfo ? false : true}
                                    value={updateObjInfo.phone}
                                    onChange={(e) =>
                                        dispatch(
                                            handleOnChangeInfo({
                                                field: "phone",
                                                value: e.target.value,
                                            })
                                        )
                                    }
                                    className={`w-full p-2 border border-custom-500 rounded-sm ${
                                        errors.phone && "border-red-400"
                                    }`}
                                />
                                {errors.phone && (
                                    <span className="text-xs text-red-500">
                                        * {errors.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-1 flex items-center">
                            <h4 className="w-[160px] text-sm sm:text-lg">
                                Address
                            </h4>
                            <div className="max-w-lg w-full">
                                <input
                                    type="text"
                                    disabled={openUpdateInfo ? false : true}
                                    value={updateObjInfo.address}
                                    onChange={(e) =>
                                        dispatch(
                                            handleOnChangeInfo({
                                                field: "address",
                                                value: e.target.value,
                                            })
                                        )
                                    }
                                    className={`w-full p-2 border border-custom-500 rounded-sm ${
                                        errors.address && "border-red-400"
                                    }`}
                                />
                                {errors.address && (
                                    <span className="text-xs text-red-500">
                                        * {errors.address}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between sm:justify-start sm:gap-4">
                            <button
                                onClick={() => setUpdatePass((pre) => !pre)}
                                className="text-sky-300"
                            >
                                Update password
                            </button>
                            {openUpdatePass && (
                                <button
                                    onClick={handleUpdatePass}
                                    className="text-sky-300"
                                >
                                    Save
                                </button>
                            )}
                        </div>
                        {openUpdatePass && (
                            <>
                                <div className="mt-1 flex items-center">
                                    <h4 className="w-[160px] text-sm sm:text-lg">
                                        Curent password
                                    </h4>
                                    <input
                                        type="password"
                                        onChange={(e) =>
                                            dispatch(
                                                handleOnChangePass({
                                                    field: "currentpass",
                                                    value: e.target.value,
                                                })
                                            )
                                        }
                                        className="max-w-lg w-full p-2 border border-custom-500 rounded-sm"
                                    />
                                </div>
                                <div className="mt-1 flex items-center">
                                    <h4 className="w-[160px] text-sm sm:text-lg">
                                        New password
                                    </h4>
                                    <input
                                        type="password"
                                        onChange={(e) =>
                                            dispatch(
                                                handleOnChangePass({
                                                    field: "newpass",
                                                    value: e.target.value,
                                                })
                                            )
                                        }
                                        className="max-w-lg w-full p-2 border border-custom-500 rounded-sm"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* orders */}
                {orders && orders.length > 0 && (
                    <div className="mt-8 overflow-x-auto">
                        <h3 className="mb-4">Your order</h3>
                        <table className="w-full table-auto text-sm text-left">
                            <thead className="bg-gray-50 text-gray-600 font-medium border-b dark:bg-primary dark:text-custom-1000">
                                <tr>
                                    <th className="py-3 px-2">#</th>
                                    <th className="py-3 px-2">OrderCode</th>
                                    <th className="py-3 px-6">
                                        Address Shipping
                                    </th>
                                    <th className="py-3 px-6">Total Price</th>
                                    <th className="py-3 px-2">Order Date</th>
                                    <th className="py-3 px-2">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 divide-y dark:text-custom-1000">
                                {orders.map((item, index) => (
                                    <tr>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            #{item.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.address}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.discout
                                                ? formattedPrice(
                                                      item.totalPrice -
                                                          (item.totalPrice *
                                                              item.discout) /
                                                              100
                                                  )
                                                : formattedPrice(
                                                      item.totalPrice
                                                  )}
                                        </td>
                                        <td className="px-2 py-4 whitespace-nowrap">
                                            <div>
                                                {new Date(
                                                    item.createdAt
                                                ).toLocaleDateString("en-GB")}
                                            </div>
                                            <div>
                                                {new Date(
                                                    item.createdAt
                                                ).toLocaleTimeString()}
                                            </div>
                                        </td>
                                        <td
                                            className={`px-2 py-4 whitespace-nowrap`}
                                        >
                                            <span
                                                className={`px-2 rounded-lg
                                            ${
                                                item.status === "pending"
                                                    ? "bg-gray-300 text-gray-600"
                                                    : item.status ===
                                                      "processing"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : item.status === "shipping"
                                                    ? "bg-purple-100 text-purple-600"
                                                    : item.status ===
                                                      "delivered"
                                                    ? "bg-green-100 text-green-600"
                                                    : item.status === "cancel"
                                                    ? "bg-red-100 text-red-600"
                                                    : "text-black"
                                            }
                                        `}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
};

export default Profile;
