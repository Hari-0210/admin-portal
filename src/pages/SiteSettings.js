import { Button, Container, Grid, Stack, Typography, styled } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Controller, useForm } from 'react-hook-form';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch } from 'react-redux';
import { FormLabel, MESSAGE } from '../utils/message';
import { Textfield } from '../utils/formLib';
import { useSnackbar } from '../utils/CommonSnack';
import { getUserDetails } from '../utils/utility';
import { fetchProductImg, uploadImageApi } from '../slices/product';
import { IsLoadingHOC } from '../utils/hoc/loader';
import http from '../utils/http-common';
import { fetchSiteSettings } from '../slices/siteSettings';

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

function SiteSettings(props) {
  const [img, setImg] = useState([]);
  const [imgData, setImgData] = useState('');
  const [siteSettings, setSiteSettings] = useState({});
  const { setLoading } = props;
  const dispatch = useDispatch();
  const { showSnackbar } = useSnackbar();
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      mobile: '',
      email: '',
      address: '',
      insta: '',
    },
  });
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
  const getImg = async (data) => {
    console.log(data);
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
  const getSettings = () => {
    const payload = {
      storeId: getUserDetails().storeid,
    };
    dispatch(fetchSiteSettings(payload))
      .unwrap()
      .then((data) => {
        console.log(JSON.parse(data.data.settingsJson));
        setSiteSettings({ ...JSON.parse(data?.data?.settingsJson) });
        reset({ ...JSON.parse(data?.data?.settingsJson) });
        getImg([JSON.parse(data?.data?.settingsJson)?.img]);
        setImg([{ path: JSON.parse(data?.data?.settingsJson)?.img }]);
      })
      .catch((e) => {
        console.log(e);
        showSnackbar(e.message, 'error');
      });
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
      ...data,
      img: img[0].path,
      storeId: getUserDetails().storeid,
    };
    try {
      const response = await http.post('/store/addSettings', payload);
      if (response.data.status === 200) {
        setLoading(false);
        showSnackbar(`Site Settings updated  successfully`, 'success');
        getSettings();
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

  useEffect(() => {
    getSettings();
  }, []);

  return (
    <div>
      <Helmet>
        <title> Site Settings: Etagers </title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h4" gutterBottom>
            Site Settings
          </Typography>
        </Stack>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <Controller
                name="name"
                control={control}
                rules={{
                  required: MESSAGE.required,
                }}
                render={({ field }) => (
                  <Textfield
                    {...field}
                    label={FormLabel.name}
                    error={Boolean(errors.name)}
                    helperText={errors.name?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name="mobile"
                control={control}
                rules={{
                  required: MESSAGE.required,
                }}
                render={({ field }) => (
                  <Textfield
                    {...field}
                    label={FormLabel.mobile}
                    error={Boolean(errors.mobile)}
                    helperText={errors.mobile?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: MESSAGE.required,
                }}
                render={({ field }) => (
                  <Textfield
                    {...field}
                    label={FormLabel.email}
                    error={Boolean(errors.email)}
                    helperText={errors.email?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name="address"
                control={control}
                rules={{
                  required: MESSAGE.required,
                }}
                render={({ field }) => (
                  <Textfield
                    {...field}
                    label={FormLabel.address}
                    error={Boolean(errors.address)}
                    helperText={errors.address?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Controller
                name="insta"
                control={control}
                rules={{
                  required: MESSAGE.required,
                }}
                render={({ field }) => (
                  <Textfield
                    {...field}
                    label={FormLabel.insta}
                    error={Boolean(errors.insta)}
                    helperText={errors.insta?.message}
                    required
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Typography sx={{ mb: 2, mt: 2 }}>Logo</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} container>
                  <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
                    Upload Img
                    <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                  </Button>
                </Grid>
                {imgData ? (
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
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} container justifyContent="center" mt={3}>
                <Button variant="contained" style={{ marginRight: 10 }} onClick={handleSubmit(onSubmit)}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
}

export default IsLoadingHOC(SiteSettings, 'Loading....');
