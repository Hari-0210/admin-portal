import { Box, Grid, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import EditIcon from '@mui/icons-material/Edit';
import Fields from '../../components/Field';
import http from '../../utils/http-common';
import MuiTable from '../../components/table';
import { makeColumn, makePayload } from '../../utils/utility';
import { useSnackbar } from '../../utils/CommonSnack';
import GenericDialog from '../../components/Dialog';
import { IsLoadingHOC } from '../../utils/hoc/loader';
import fieldData from '../../utils/pages.json';

function Form({ sectionName, sectionData, setLoading }) {
  const { showSnackbar } = useSnackbar();
  const [showForm, setShowForm] = useState(false);
  const [data, setData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const col = makeColumn(data);
  const endpoint = `/crud/${fieldData[sectionName].tableName}`;
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
  const handleEdit = (data) => {
    setIsEdit(true);
    reset(data);
    setShowForm(true);
  };
  const initialValues = {};
  sectionData.fields.forEach((field) => {
    initialValues[field.name] = field.value !== undefined ? field.value : '';
  });

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

  const handleAdd = () => {
    setShowForm(true);
    setIsEdit(false);
    reset(initialValues);
  };
  const onSubmit = async (data) => {
    setLoading(true);
    const payload = makePayload(sectionName, isEdit ? 'UPDATE' : 'INSERT', data, 'AND');
    try {
      const response = await http.post(endpoint, payload);
      if (response.data.status === 200) {
        setLoading(false);
        showSnackbar(
          `${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)} ${
            isEdit ? 'updated' : 'created'
          } successfully`,
          'success'
        );
        reset(initialValues);
        setIsEdit(false);
        setShowForm(false);
        getData();
        return response.data.data;
      }
      setLoading(false);
      showSnackbar(response.data.message, 'error');
      return Promise.resolve();
    } catch (error) {
      setLoading(false);
      console.error('API Error:', error);
      showSnackbar(error.message, 'error');
      return Promise.reject();
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionData]);
  const getData = async () => {
    setLoading(true);
    if (sectionData) {
      try {
        const payload = makePayload(sectionName, 'SELECT', [], 'AND');
        const response = await http.post(endpoint, payload);
        if (response.data.status === 200) {
          setLoading(false);
          setData([...response.data.data]);
        } else {
          setLoading(false);
          setData([]);
          showSnackbar(response.data.message, 'error');
        }
      } catch (error) {
        setData([]);
        setLoading(false);
        console.error('API Error:', error);
        showSnackbar(error.message, 'error');
      }
    }
  };
  return (
    <div>
      <h1>{sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}</h1>
      <GenericDialog
        open={showForm}
        title={`${isEdit ? 'Update' : 'Add'} ${sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}`}
        onClose={() => {
          setShowForm(false);
        }}
        maxWidth={'md'}
        onSubmit={handleSubmit(onSubmit)}
        buttonText={isEdit ? 'Update' : 'Submit'}
        content={
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
              {sectionData.fields.map((field, i) => (
                <Grid xs={field.xs} sm={field.sm} item key={field.name}>
                  <Fields
                    index={i}
                    value={field.value}
                    fields={field}
                    formControl={{
                      control,
                      errors,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </form>
        }
      />

      <Grid item xs={12}>
        <MuiTable columns={col} data={data} actions={actions} add handleAdd={handleAdd} />
      </Grid>
    </div>
  );
}
Form.propTypes = {
  sectionName: PropTypes.string.isRequired,
  sectionData: PropTypes.object.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default IsLoadingHOC(Form, 'Loading....');
