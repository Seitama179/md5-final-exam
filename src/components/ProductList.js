import {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import * as ProductService from "../service/ProductService";
import 'bootstrap/dist/css/bootstrap.min.css';
import {toast} from 'react-toastify';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [noResults, setNoResults] = useState(false);
    const [, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await getAllData(name, categoryId);
            } catch (error) {
                toast.error("Có lỗi xảy ra khi tải dữ liệu");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [name, categoryId]);
    const getAllData = async (name, categoryId) => {
        let productRes = await ProductService.getAllProducts(name, categoryId);
        let categoryRes = await ProductService.getAllCategories();

        productRes = productRes.filter(product => {
            const matchesName = name ? product.name.toLowerCase().includes(name.toLowerCase()) : true;
            const matchesCategory = categoryId ? product.categoryId === categoryId : true;
            return matchesName && matchesCategory;
        });

        productRes.sort((a, b) => a.name.localeCompare(b.name));

        const combinedData = productRes.map(product => {
            const category = categoryRes.find(p => p.id === product.categoryId);
            return {
                ...product, categoryName: category ? category.name : 'Không xác định'
            };
        });

        setProducts(combinedData);
        setCategories(categoryRes);

        combinedData.length === 0 ? setNoResults(true) : setNoResults(false);
    }

    const formatDate = (dateString) => {
        const options = {day: '2-digit', month: '2-digit', year: 'numeric'};
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    return (
        <div className="container mt-5">

            <h2 className="mb-4 text-center text-light bg-primary">Danh sách sản phẩm</h2>
            <div className="mb-4">
                <Link to="/create" className="btn btn-secondary">Thêm mới sản phẩm</Link>
            </div>

            <div className="row mb-4">
                <div className="col-md-6">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo tên sản phẩm"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="col-md-6">
                    <select
                        className="form-control"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                    >
                        <option value="">Tất cả danh mục</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            {noResults ? (
                <div className="alert alert-info" role="alert">
                    Không có sản phẩm nào khớp với tìm kiếm của bạn.
                </div>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-bordered">
                        <thead className="thead-light text-center">
                        <tr>
                            <th scope="col">STT</th>
                            <th scope="col">Mã sản phẩm</th>
                            <th scope="col">Tên sản phẩm</th>
                            <th scope="col">Danh mục</th>
                            <th scope="col">Ngày thêm sản phẩm</th>
                            <th scope="col">Số lượng</th>
                            <th scope="col">Giá tiền</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((item, index) => (
                            <tr key={item.id}>
                                <th scope="row">{index + 1}</th>
                                <td>{item.productCode}</td>
                                <td>{item.name}</td>
                                <td>{item.categoryName}</td>
                                <td>{formatDate(item.dateAdded)}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price.toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ProductList;