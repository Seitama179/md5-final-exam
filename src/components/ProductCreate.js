import {useState, useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import * as productService from "../service/ProductService";
import {toast} from "react-toastify";
import * as Yup from "yup";
import {ErrorMessage, Field, Form, Formik} from "formik";

function ProductCreate() {
    const [form] = useState({
        productCode: "",
        name: "",
        categoryId: "",
        price: 0,
        quantity: 0,
        dateAdded: "",
        description: ""
    });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await productService.getAllCategories();
                setCategories(response || []);
            } catch (error) {
                toast.error("Không thể load được danh mục sản phẩm");
            }
        };
        fetchCategories();
    }, []);

    const validationSchema = Yup.object({
        productCode: Yup.string()
            .matches(/^PROD-\d{4}$/, "Mã sản phẩm phải đúng định dạng PROD-XXXX")
            .required("Mã sản phẩm là bắt buộc"),
        name: Yup.string()
            .max(100, "Tên sản phẩm không dài quá 100 ký tự")
            .required("Tên sản phẩm là bắt buộc"),
        categoryId: Yup.string().required("Danh mục sản phẩm là bắt buộc"),
        price: Yup.number()
            .positive("Giá phải lớn hơn 0")
            .required("Giá sản phẩm là bắt buộc"),
        quantity: Yup.number()
            .integer("Số lượng phải là số nguyên")
            .positive("Số lượng phải lớn hơn 0")
            .required("Số lượng sản phẩm là bắt buộc"),
        dateAdded: Yup.date()
            .max(new Date(), "Ngày thêm sản phẩm không được lớn hơn ngày hiện tại")
            .required("Ngày thêm sản phẩm là bắt buộc"),
        description: Yup.string().max(500, "Mô tả không dài quá 500 ký tự")
    });

    const saveProduct = async (values) => {
        try {
            const isSuccess = await productService.saveProduct(values);
            if (isSuccess) {
                toast.success("Thêm mới sản phẩm thành công");
                // alert("thêm thành công");
                navigate("/products");
            } else {
                toast.error("Thêm mới sản phẩm thất bại");
            }
        } catch (error) {
            toast.error("Có lỗi xảy ra khi thêm sản phẩm");
        }
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                    <div className="card shadow-sm">

                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0 text-center">Thêm Sản Phẩm Mới</h4>
                        </div>

                        <div className="card-body">
                            <Formik
                                initialValues={form}
                                onSubmit={saveProduct}
                                validationSchema={validationSchema}
                            >

                                <Form>
                                    <div className="mb-3">
                                        <label htmlFor="productCode" className="form-label">Mã Sản Phẩm:</label>
                                        <Field name="productCode" type="text" className="form-control"/>
                                        <ErrorMessage name="productCode" component="div" className="text-danger"/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="name" className="form-label">Tên Sản Phẩm:</label>
                                        <Field name="name" type="text" className="form-control"/>
                                        <ErrorMessage name="name" component="div" className="text-danger"/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="categoryId" className="form-label">Danh Mục:</label>
                                        <Field as="select" name="categoryId" className="form-select">
                                            <option value="">Chọn Danh Mục</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="categoryId" component="div" className="text-danger"/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="price" className="form-label">Giá:</label>
                                        <Field name="price" type="number" className="form-control"/>
                                        <ErrorMessage name="price" component="div" className="text-danger"/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="quantity" className="form-label">Số Lượng:</label>
                                        <Field name="quantity" type="number" className="form-control"/>
                                        <ErrorMessage name="quantity" component="div" className="text-danger"/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="dateAdded" className="form-label">Ngày Thêm Sản Phẩm:</label>
                                        <Field name="dateAdded" type="date" className="form-control"/>
                                        <ErrorMessage name="dateAdded" component="div" className="text-danger"/>
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="description" className="form-label">Mô Tả:</label>
                                        <Field name="description" as="textarea" className="form-control" rows="4"/>
                                        <ErrorMessage name="description" component="div" className="text-danger"/>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <button type="submit" className="btn btn-primary">Thêm Mới</button>
                                        <Link to={"/products"} className="btn btn-danger">Huỷ</Link>
                                    </div>
                                </Form>
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductCreate;