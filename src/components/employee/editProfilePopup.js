
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box
} from '@mui/material';
const validationSchema = Yup.object({
    name: Yup.string()
        .min(3, 'Require minisize 3 character')
        .required('name must be not blank'),
    email: Yup.string()
        .email('Email is not valid')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Phone number is not valid')
        .required('Phone number must be not number'),
});
const EditProfilePopup = ({ open, onClose, employeeData, onSave }) => {
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            id: employeeData?.id || '',
            name: employeeData?.name || '',
            email: employeeData?.email || '',
            phone: employeeData?.phone || '',
        },
        // Schema validation
        validationSchema: validationSchema,
        onSubmit: (values) => {
            onSave(values);
            onClose();
        },
    });


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" >
            <Box component="form" sx={{ mt: 2 }} onSubmit={formik.handleSubmit}>
                <DialogTitle>Edit Profile Form</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ mt: 2 }}>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            name="name"
                            label="Name"
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur} // Quan trọng để tracking "touched"
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <TextField
                            margin="dense"
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            fullWidth
                            variant="outlined"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                        <TextField
                            margin="dense"
                            id="phone"
                            name="phone"
                            label="Phone Number"
                            type="tel"
                            fullWidth
                            variant="outlined"
                            value={formik.values.phone}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: '16px 24px' }}>
                    <Button onClick={onClose} color="secondary">Cancel</Button>
                    <Button type="submit" variant="contained" color="primary">
                        Save change
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default EditProfilePopup;