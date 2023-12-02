import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
} from '@mui/material';
// components
import { useDispatch } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ConfirmationModal from '../components/ConfirmationModal';
import { Textfield } from '../utils/formLib';
import { useSnackbar } from '../utils/CommonSnack';
import { fetchProductImg, fetchProducts, uploadImageApi } from '../slices/product';
import { getUserDetails, makePayload } from '../utils/utility';
import MuiTable from '../components/table/Table';
import GenericDialog from '../components/Dialog';
import Fields from '../components/Field';
import { IsLoadingHOC } from '../utils/hoc/loader';
import http from '../utils/http-common';
import productField from '../utils/fieldsJson/productJson.json';
import Iconify from '../components/iconify/Iconify';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
// ----------------------------------------------------------------------

function ProductsPage(props) {
  const { setLoading } = props;
  const [products, setProducts] = useState([]);
  const [img, setImg] = useState([]);
  const [imgData, setImgData] = useState('');
  const [category, setcategory] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [isEditAttribute, setIsEditAttribute] = useState(false);
  const [openAttribute, setOpenAttribute] = useState(false);
  const [attributeData, setAttributeData] = useState({});
  const [open, setOpen] = useState(null);
  const [editAttribute, setEditAttribute] = useState({});
  const [editAttributeKey, setEditAttributeKey] = useState({});
  const [openConfirmation, setOpenConfirmation] = useState(false);

  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  let initialValues = {};
  productField.fields.forEach((field) => {
    initialValues[field.name] = field.type === 'multiselect' ? [] : '';
  });
  initialValues = {
    ...initialValues,
    categories: [],
  };
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      ...initialValues,
    },
  });
  const initialValuesAttribute = {
    attributes: {
      title: {
        name: '',
        options: '',
      },
    },
  };
  const {
    handleSubmit: handleSubmitAttribute,
    reset: resetAttribute,
    control: controlAttribute,
    formState: { errors: errorsAttribute },
    getValues: getValuesAttribute,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      ...initialValuesAttribute,
    },
  });

  const getProducts = () => {
    const payload = {
      storeId: getUserDetails().storeid,
    };
    dispatch(fetchProducts(payload))
      .unwrap()
      .then((data) => {
        setProducts([...data.data]);
      })
      .catch((e) => {
        console.log(e);
        showSnackbar(e.message, 'error');
      });
  };

  useEffect(() => {
    getProducts();
    getCategory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const col = [
    {
      accessorKey: 'name',
      header: 'Product Name',
    },
    {
      accessorKey: 'sellingPrice',
      header: 'Selling Price',
    },
    {
      accessorKey: 'qty',
      header: 'Quantity',
    },
  ];
  const data = products;

  const handleOpenMenu = (event, attributeKey, attributeValue) => {
    setEditAttributeKey({ key: attributeKey });
    setEditAttribute({ ...attributeValue });
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };
  const handleAdd = () => {
    setShowForm(true);
    setIsEdit(false);
    reset(initialValues);
    resetAttribute(initialValuesAttribute);
    setAttributeData({});
    combinations = [];
    setImg([]);
    setImgData('');
  };
  const actions = ({ row }) => (
    <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
      <IconButton
        color="secondary"
        onClick={() => {
          handleEdit(row.original);
        }}
      >
        <EditIcon />
      </IconButton>
    </Box>
  );
  const extractAttributes = (data) =>
    Object.keys(data.attributes).reduce((acc, key) => {
      const parts = key.split(', ').map((part) => part.split(' - '));

      parts.forEach((element) => {
        let property;
        let value;

        if (element.length === 3) [, property, value] = element;
        else [property, value] = element;

        if (property !== 'quantity' && property !== 'sellingPrice') {
          if (!acc[property]) acc[property] = [];
          if (!acc[property].includes(value)) acc[property].push(value);
        }
      });

      return acc;
    }, {});

  const formatAttributes = (attributes) =>
    Object.entries(attributes).map(([property, values], index) => ({
      [`attribute ${index + 1}`]: {
        attributes: {
          title: {
            name: property,
            options: values.join(','),
          },
        },
      },
    }));

  /**
   * Handles the edit functionality for a product.
   * Sets the component state and prepares data for editing.
   * @param {Object} data - The data of the product being edited.
   */
  const handleEdit = (data) => {
    setIsEdit(true);
    reset(data);
    // Extract and format attributes data for display in the form
    const attributes = extractAttributes(data);
    const formattedAttributes = formatAttributes(attributes);

    setAttributeData({ ...formattedAttributes.reduce((acc, item) => ({ ...acc, ...item }), {}) });
    resetAttribute({ ...data.attributes });
    getImg(data.img);
    setImg(data.img.map((e) => ({ path: e })));
    setShowForm(true);
  };

  const getImg = async (data) => {
    const payload = {
      storeId: getUserDetails().storeid,
      fileName: data[0],
    };
    dispatch(fetchProductImg(payload))
      .unwrap()
      .then((data) => {
        const imageBuffer = new Uint8Array(data.data.image.data);
        const blob = new Blob([imageBuffer], { type: 'image/jpeg' });
        const base64String = URL.createObjectURL(blob);
        setImgData(base64String);
      })
      .catch((e) => {
        console.log(e);
        showSnackbar(e.message, 'error');
      });
  };

  const getCategory = async () => {
    setLoading(true);
    try {
      const payload = makePayload('category', 'SELECT', [], 'AND');
      const response = await http.post('/crud/categories', payload);
      if (response.data.status === 200) {
        setLoading(false);
        setcategory([...response.data.data]);
      } else {
        setLoading(false);
        setcategory([]);
        showSnackbar(response.data.message, 'error');
      }
    } catch (error) {
      setcategory([]);
      setLoading(false);
      console.error('API Error:', error);
      showSnackbar(error.message, 'error');
    }
  };

  const onSubmit = async (data) => {
    const attributes = getValuesAttribute();
    delete attributes.attributes;
    setLoading(true);
    const payload = {
      ...data,
      attributes,
      img: img?.map((e) => e?.path),
      storeId: getUserDetails().storeid,
      ...(isEdit && { productId: data.productId }),
    };
    try {
      const response = await http.post(isEdit ? '/product/update' : '/product/add', payload);
      if (response.data.status === 200) {
        setLoading(false);
        showSnackbar(`Product ${isEdit ? 'updated' : 'created'}  successfully`, 'success');
        reset(initialValues);
        setIsEdit(false);
        setShowForm(false);
        setAttributeData({});
        getProducts();
        combinations = [];
        setImg([]);
        return response.data.data;
      }
      setLoading(false);
      showSnackbar(response.data.message, 'error');
      return Promise.resolve();
    } catch (error) {
      setLoading(false);
      console.error('API Error:', error);
      showSnackbar(error.message, 'error');
      return Promise.reject(new Error('Something went wrong'));
    }
  };
  function calculateOptions(variable) {
    switch (variable) {
      case 'category':
        return category.map((e) => ({
          label: e.category_name,
          value: String(e.category_id),
        }));
      default:
        return [];
    }
  }
  const onSubmitAttribute = async (data) => {
    if (isEditAttribute) {
      setAttributeData({
        ...attributeData,
        [`${editAttributeKey.key}`]: data,
      });
    } else {
      const attributeLength = Object.keys(attributeData).length + 1;
      setAttributeData({
        ...attributeData,
        [`attribute ${attributeLength}`]: data,
      });
    }
    setOpenAttribute(false);
    resetAttribute(initialValuesAttribute);
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const uploadImage = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('storeId', getUserDetails().storeid);
    dispatch(uploadImageApi(formData))
      .unwrap()
      .then((data) => {
        setImg([{ ...data.data }]);
        getImg([data.data.path]);
        showSnackbar(data.message, 'success');
      })
      .catch((e) => {
        console.log(e);
        showSnackbar(e.message, 'error');
      });
  };
  function generateCombinationsHelper(combinations, index, currentCombination, resultCombinations) {
    if (index === combinations.length) {
      resultCombinations.push(currentCombination.join(', '));
      return;
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const element of combinations[index]) {
      generateCombinationsHelper(combinations, index + 1, [...currentCombination, element], resultCombinations);
    }
  }

  function generateCombinationsSub(combinations) {
    const resultCombinations = [];
    generateCombinationsHelper(combinations, 0, [], resultCombinations);
    return resultCombinations;
  }

  function generateCombinations(attributeData) {
    const combinations = [];

    // Generate combinations for each attribute
    Object.values(attributeData).forEach((attribute) => {
      const title = attribute.attributes.title.name;
      const options = attribute.attributes.title.options.split(',');
      const attributeCombinations = options.map((option) => `${title} - ${option}`);
      combinations.push(attributeCombinations);
    });

    const resultCombinations = generateCombinationsSub(combinations);

    return resultCombinations;
  }
  let combinations = generateCombinations(attributeData);
  const handleConfirmation = async () => {
    setOpenConfirmation(false);

    // Your logic to delete the attribute goes here
    try {
      // Perform the deletion API call or any other logic
      // You might need to pass the attribute key or some identifier to the API
      // For example, you could pass editAttributeKey.key to identify the attribute
      // const response = await deleteAttributeFunction(editAttributeKey.key);

      // Assuming a successful response means the deletion was successful
      // Update the attributeData state to reflect the deletion
      setAttributeData((prevData) => {
        const newData = { ...prevData };
        delete newData[editAttributeKey.key];
        return newData;
      });
      handleCloseMenu();
      showSnackbar('Attribute deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting attribute:', error);
      showSnackbar('Failed to delete attribute', 'error');
    }
  };

  const handleClose = () => {
    setShowForm(false);
    setImgData('');
  };
  return (
    <>
      <Helmet>
        <title> Dashboard: Products | Etagers </title>
      </Helmet>
      {!showForm ? (
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Products
            </Typography>
            <Button variant="contained" onClick={handleAdd} startIcon={<Iconify icon="eva:plus-fill" />}>
              New Products
            </Button>
          </Stack>

          <MuiTable columns={col} data={data} actions={actions} />
        </Container>
      ) : (
        <Container>
          <Typography variant="h4" sx={{ mb: 2 }}>
            <ArrowBackIcon onClick={() => handleClose()} sx={{ mr: '8px', mt: '5px' }} />
            {isEdit ? 'Update' : 'Add'} Product
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {productField.fields.map((field, i) => (
                <Grid xs={field.xs} sm={field.sm} item key={field.name}>
                  <Fields
                    index={i}
                    value={field.value}
                    fields={
                      field.isOptionVariable
                        ? {
                            ...field,
                            options: calculateOptions(field.optionsVariable),
                          }
                        : field
                    }
                    formControl={{
                      control,
                      errors,
                    }}
                  />
                </Grid>
              ))}
              <Grid xs={12} sm={12} item>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography>Add Attribute </Typography>
                  </Grid>
                  <Grid item>
                    &nbsp;{' '}
                    <AddBoxIcon
                      onClick={() => {
                        if (Object.keys(attributeData).length >= 3) {
                          showSnackbar('Not allowed to add more that 3', 'error');
                          return;
                        }
                        setOpenAttribute(true);
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {Object.keys(attributeData).length > 0 && (
                <>
                  <Grid xs={12} sm={12} item>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Options</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {Object.entries(attributeData).map(([attributeKey, attributeValue]) => (
                            <TableRow key={attributeKey}>
                              <TableCell>{attributeValue.attributes.title.name}</TableCell>
                              <TableCell>{attributeValue.attributes.title.options}</TableCell>
                              <TableCell>
                                <IconButton
                                  size="large"
                                  color="inherit"
                                  onClick={(e) => handleOpenMenu(e, attributeKey, attributeValue)}
                                >
                                  <Iconify icon={'eva:more-vertical-fill'} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                  <Grid xs={12} sm={12} item>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Options</TableCell>
                            <TableCell align="center" style={{ maxWidth: '150px' }}>
                              Quantity
                            </TableCell>
                            <TableCell align="center" style={{ maxWidth: '150px' }}>
                              Selling Price
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {combinations.map((combination) => (
                            <TableRow key={combination}>
                              <TableCell>{combination}</TableCell>
                              <TableCell align="center">
                                <Controller
                                  name={`quantity - ${combination}`}
                                  control={controlAttribute}
                                  render={({ field }) => (
                                    <Textfield
                                      {...field}
                                      label={'Quantity'}
                                      variant={'outlined'}
                                      onChange={(e) => {
                                        field.onChange(e);
                                      }}
                                    />
                                  )}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Controller
                                  name={`sellingPrice - ${combination}`}
                                  control={controlAttribute}
                                  render={({ field }) => (
                                    <Textfield
                                      {...field}
                                      label={'Selling Price'}
                                      variant={'outlined'}
                                      onChange={(e) => {
                                        field.onChange(e);
                                      }}
                                    />
                                  )}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </>
              )}
            </Grid>
            <Popover
              open={Boolean(open)}
              anchorEl={open}
              onClose={() => {
                handleCloseMenu();
              }}
              anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  p: 1,
                  width: 140,
                  '& .MuiMenuItem-root': {
                    px: 1,
                    typography: 'body2',
                    borderRadius: 0.75,
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  resetAttribute({ ...editAttribute });
                  setIsEditAttribute(true);
                  setOpenAttribute(true);
                  setOpen(false);
                }}
              >
                <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
                Edit
              </MenuItem>

              <MenuItem
                onClick={() => {
                  setOpenConfirmation(true);
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} sx={{ mr: 2 }} />
                Delete
              </MenuItem>
            </Popover>
          </form>
          <GenericDialog
            open={openAttribute}
            title={`${isEditAttribute ? 'Update' : 'Add'} Attribute`}
            onClose={() => {
              setOpenAttribute(false);
              resetAttribute(initialValuesAttribute);
              setIsEditAttribute(false);
            }}
            maxWidth={'sm'}
            onSubmit={handleSubmitAttribute(onSubmitAttribute)}
            buttonText={`${isEditAttribute ? 'Update' : 'Submit'}`}
            content={
              <form onSubmit={handleSubmitAttribute(onSubmitAttribute)}>
                <Grid container spacing={2}>
                  <Grid xs={12} sm={4} item>
                    <Controller
                      name={'attributes.title.name'}
                      control={controlAttribute}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Textfield
                          {...field}
                          label={'Title'}
                          variant={'outlined'}
                          error={!!errorsAttribute?.attributes?.title?.name}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          helperText={
                            errorsAttribute?.attributes?.title?.name
                              ? errorsAttribute?.attributes?.title?.name?.type === 'required'
                                ? 'This field is required'
                                : errorsAttribute?.attributes?.title?.name?.message
                              : ''
                          }
                        />
                      )}
                    />
                  </Grid>
                  <Grid xs={12} sm={8} item>
                    <Controller
                      name={'attributes.title.options'}
                      control={controlAttribute}
                      rules={{ required: true }}
                      render={({ field }) => (
                        <Textfield
                          {...field}
                          label={'Title Options'}
                          variant={'outlined'}
                          error={!!errorsAttribute?.attributes?.title?.options}
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                          helperText={`${
                            errorsAttribute?.attributes?.title?.options
                              ? errorsAttribute?.attributes?.title?.options?.type === 'required'
                                ? 'This field is required'
                                : errorsAttribute?.attributes?.title?.options?.message
                              : ''
                          } Please give as comma separated`}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </form>
            }
          />
          <Typography sx={{ mb: 2, mt: 2 }}>Product Images</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} container>
              <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                Upload Img
                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
              </Button>
            </Grid>
            {img.length ? (
              <Grid item xs={4} container>
                <div
                  style={{
                    maxWidth: '100%',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {imgData ? (
                    <img src={imgData} alt="login" style={{ width: '50px', height: '50px', display: 'block' }} />
                  ) : null}
                </div>
              </Grid>
            ) : null}
          </Grid>
          <ConfirmationModal
            open={openConfirmation}
            handleClose={() => {
              setOpenConfirmation(false);
            }}
            handleOpenModal={() => handleConfirmation()}
            type={'DELETE'}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} container justifyContent="center" mt={3}>
              <Button variant="contained" style={{ marginRight: 10 }} onClick={handleSubmit(onSubmit)}>
                {isEdit ? 'Update' : 'Save'}
              </Button>
              <Button
                onClick={() => {
                  handleClose();
                }}
                variant="outlined"
                color="inherit"
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Container>
      )}
    </>
  );
}
ProductsPage.propTypes = {
  setLoading: PropTypes.func.isRequired,
};
export default IsLoadingHOC(ProductsPage, 'Loading....');
