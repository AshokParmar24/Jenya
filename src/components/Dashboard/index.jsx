import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Tooltip,
  Select,
  MenuItem,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteProuctApi, getProductList } from "../../services/api";
import { updateProductList } from "../../redux/actions/productAction";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [productData, setProductData] = useState(null);
  const { productList } = useSelector((state) => state?.productReducer);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const fetchProductList = async () => {
    setLoading(true);

    try {
      const response = await getProductList();
      console.log("responseresponseresponse", response);
      if (response.status === 200) {
        dispatch(updateProductList(response?.data?.products));
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductList();
  }, []);

  const handleDelete = (product) => {
    setOpen(true);
    setProductData(product);
  };

  const handleClose = () => {
    setOpen(false);
    setProductData(null);
  };

  const confirmDeleteProduct = async () => {
    try {
      const response = await deleteProuctApi(productData?.id);
      if (response.status === 200) {
        setOpen(false);
        setProductData(null);
        fetchProductList();
        toast.success("delete successfully");
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100vh"
          width="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Typography variant="h3">Product List</Typography>
          <Box mb={3} display="flex" flexWrap="wrap" gap={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/new-product")}
            >
              Add Product
            </Button>
          </Box>
          {productList.length ? (
            <Grid
              container
              spacing={4}
              columns={{ xs: 3, sm: 8, md: 12, lg: 12 }}
            >
              {productList.map((product) => (
                <Grid
                  item
                  key={product.id}
                  size={{ xs: 12, sm: 4, md: 4, lg: 3 }}
                >
                  <Box
                    onClick={() => console.log(product)}
                    sx={{ cursor: "pointer" }}
                  >
                    <Card>
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.images[0]}
                        alt={product.title}
                      />
                      <CardContent>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            {product.title}
                          </Typography>
                          <Box sx={{ display: "flex", gap: "5px" }}>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() =>
                                navigate(`/edit-product/${product.id}`)
                              }
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(product)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>

                        <Tooltip title={product.description}>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                           description: {product.description}
                          </Typography>
                        </Tooltip>
                        <Typography color="text.secondary">
                          ${product.price}
                        </Typography>
                        <Typography variant="body2">
                         category: {product.category}
                        </Typography>
                         <Typography variant="body2">
                         brand: {product.brand}
                        </Typography>
                         
                      </CardContent>
                    </Card>
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="h6">No Product found</Typography>
          )}
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              <Typography>
                Are you sure you want to delete{" "}
                <strong>{productData?.title || "this product"}</strong>?
              </Typography>
            </DialogTitle>
            <DialogContent></DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={confirmDeleteProduct} autoFocus>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
