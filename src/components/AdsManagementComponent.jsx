import React, { useState, useEffect } from 'react';
import Ads from '../modal/Ads';
import { useGetModalData } from '../Controllers/UseGetModalData';
import useCreateModalData from '../Controllers/useCreateModalData';
import { useUpdateModalData } from '../Controllers/useUpdateModalData';
import { useDeleteModalData } from '../Controllers/useDeleteModalData';
import AdsForm from './forms/AdsForm';

const LoadingComponent = ({ message }) => <p>Loading {message}...</p>;
const ErrorComponent = ({ message, error }) => <p>Error loading {message}: {error.message}</p>;

const AdsManagementComponent = () => {
    const { data: fetchedAds, loading: getLoading, error: getError } = useGetModalData(new Ads());
    const { create: createAdRequest, loading: createLoading, error: createError } = useCreateModalData(new Ads());
    const { updateData, loading: updateLoading, error: updateError } = useUpdateModalData(new Ads());
    const { deleteData, loading: deleteLoading, error: deleteError } = useDeleteModalData(new Ads());
    const [ads, setAds] = useState([]);
    const [filteredAds, setFilteredAds] = useState([]);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [formMode, setFormMode] = useState('create');
    const [activeAd, setActiveAd] = useState(null);
    
    useEffect(() => {
        if (fetchedAds) {
            setAds(fetchedAds);
            setFilteredAds(fetchedAds);
        }
    }, [fetchedAds]);
    
    const loading = getLoading || createLoading || updateLoading || deleteLoading;
    const error = getError || createError || updateError || deleteError;
    
    if (loading && !filteredAds.length) { // Show loading only on initial load
        return <LoadingComponent message="Ads" />;
    }

    if (error) {
        return <ErrorComponent message="Ads" error={error} />;
    }

    const handleAdd = () => {
        setFormMode('create');
        setActiveAd(null);
        setIsFormVisible(true);
    };

    const handleUpdate = (adId) => {
        const foundAd = ads.find(ad => (ad.id || ad._id) === adId);
        if (!foundAd) return;

        setFormMode('edit');
        setActiveAd({
            id: foundAd.id || foundAd._id,
            title: foundAd.title || '',
            description: foundAd.description || '',
            price: foundAd.price || '',
            status: foundAd.status || 'active',
        });
        setIsFormVisible(true);
    };

    const closeForm = () => {
        setIsFormVisible(false);
        setActiveAd(null);
    };

    const handleFormSubmit = async (formValues) => {
        const buildAdModel = (id = null) => new Ads(
            id,
            formValues.title,
            formValues.description,
            formValues.price,
            formValues.status
        );

        if (formMode === 'edit' && activeAd) {
            const adModel = buildAdModel(activeAd.id);
            await updateData(adModel);
            setAds(prev => prev.map(ad => ((ad.id || ad._id) === activeAd.id ? { ...ad, ...formValues, id: activeAd.id } : ad)));
            setFilteredAds(prev => prev.map(ad => ((ad.id || ad._id) === activeAd.id ? { ...ad, ...formValues, id: activeAd.id } : ad)));
        } else {
            const adModel = buildAdModel(null);
            const created = await createAdRequest(adModel);
            const normalized = Ads.fromJSON ? Ads.fromJSON(created) : { ...formValues, id: created?.id || created?._id };
            const newAd = normalized?.id ? normalized : { ...formValues, id: `temp-${Date.now()}` };
            setAds(prev => [newAd, ...prev]);
            setFilteredAds(prev => [newAd, ...prev]);
        }

        closeForm();
    };

    const handleDelete = async (adId) => {
        if (window.confirm(`Are you sure you want to delete ad ${adId}?`)) {
            await deleteData(adId);
            setAds(prev => prev.filter(ad => (ad.id || ad._id) !== adId));
            setFilteredAds(prev => prev.filter(ad => (ad.id || ad._id) !== adId));
            if (activeAd && activeAd.id === adId) {
                closeForm();
            }
        }
    };

    const handleDisable = (adId) => {
        setAds(prev => prev.map(ad => {
            if ((ad.id || ad._id) === adId) {
                const updatedAd = new Ads(ad.id, ad.title, ad.description, ad.price, ad.status);
                updatedAd.toggleStatus();
                return updatedAd;
            }
            return ad;
        }));
        setFilteredAds(prev => prev.map(ad => {
            if ((ad.id || ad._id) === adId) {
                const updatedAd = new Ads(ad.id, ad.title, ad.description, ad.price, ad.status);
                updatedAd.toggleStatus();
                return updatedAd;
            }
            return ad;
        }));
    };

    return (
        <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4>Manage Ads</h4>
                <button className="btn btn-primary" onClick={handleAdd} disabled={loading}>
                    {isFormVisible ? 'Add Another Ad' : 'Add New Ad'}
                </button>
            </div>

            <AdsForm
                initialValues={activeAd || undefined}
                mode={formMode}
                isOpen={isFormVisible}
                title={formMode === 'edit' ? 'Update Ad' : 'Create Ad'}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
            />
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAds.map((ad, index) => {
                            const rowId = ad.id || ad._id || index;
                            return (
                                <tr key={rowId}>
                                    <td>{rowId}</td>
                                    <td>{ad.title}</td>
                                    <td>{ad.description}</td>
                                    <td>${ad.price}</td>
                                    <td><span className={`badge bg-${ad.status === 'active' ? 'success' : 'secondary'}`}>{ad.status}</span></td>
                                    <td style={{ minWidth: '230px' }}>
                                        <button className="btn btn-sm btn-info me-1" onClick={() => handleUpdate(rowId)} disabled={loading}>Update</button>
                                        <button className="btn btn-sm btn-danger me-1" onClick={() => handleDelete(rowId)} disabled={loading}>Delete</button>
                                        <button className="btn btn-sm btn-warning" onClick={() => handleDisable(rowId)} disabled={loading}>{ad.status === 'active' ? 'Disable' : 'Enable'}</button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdsManagementComponent;
