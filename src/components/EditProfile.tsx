import React, { useState, useEffect } from 'react';
import { User, Calendar, MapPin, Save, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import "../styles/EditProfile.css"

interface Province {
  id: string;
  nombre: string;
}

interface Locality {
  id: string;
  nombre: string;
}

interface GeografResponse {
  provincias?: Province[];
  localidades?: Locality[];
}

export interface UserProfile {
  name: string;
  email?: string;
  birthDate?: string;
  province?: string;
  locality?: string;
}



const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    selectedProvince: '',
    selectedLocality: '',
    provinceName: '',
    localityName: ''
  });

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [localities, setLocalities] = useState<Locality[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingLocalities, setLoadingLocalities] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [initialLoad, setInitialLoad] = useState(true);

  const { setUserProfile } = useUser();
  const navigate = useNavigate();


  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [message]);


  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetch("https://apis.datos.gob.ar/georef/api/provincias?campos=id,nombre&max=24");
        if (response.ok) {
          const data: GeografResponse = await response.json();
          if (data.provincias) {
            setProvinces(data.provincias.sort((a, b) => a.nombre.localeCompare(b.nombre)));
          }
        } else {
          console.error("Error al cargar provincias");
        }
      } catch (error) {
        console.error("Error de conexión al cargar provincias:", error);
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  useEffect(() => {
    if (formData.selectedProvince) {
      const fetchLocalities = async () => {
        setLoadingLocalities(true);
        setFormData(prev => ({ ...prev, selectedLocality: '', localityName: '' }));
        try {
          const response = await fetch(
            `https://apis.datos.gob.ar/georef/api/localidades?provincia=${formData.selectedProvince}&campos=id,nombre&max=500`
          );
          if (response.ok) {
            const data: GeografResponse = await response.json();
            if (data.localidades) {
              const sorted = data.localidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
              setLocalities(sorted);

              const matchedLocality = sorted.find(l => l.nombre === formData.localityName);
              if (matchedLocality) {
                setFormData(prev => ({
                  ...prev,
                  selectedLocality: matchedLocality.id
                }));
              }
            }
          } else {
            console.error("Error al cargar localidades");
            setLocalities([]);
          }
        } catch (error) {
          console.error("Error de conexión al cargar localidades:", error);
          setLocalities([]);
        } finally {
          setLoadingLocalities(false);
        }
      };

      fetchLocalities();
    } else {
      setLocalities([]);
      setFormData(prev => ({ ...prev, selectedLocality: '', localityName: '' }));
    }
  }, [formData.selectedProvince, formData.localityName]);


  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('http://localhost:3000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();

          let provinceId = '';
          if (userData.province && provinces.length > 0) {
            const province = provinces.find(p => p.nombre === userData.province);
            provinceId = province?.id || '';
          }

          setFormData({
            name: userData.name || '',
            birthDate: userData.birthDate ? userData.birthDate.split('T')[0] : '',
            selectedProvince: provinceId,
            selectedLocality: '',
            provinceName: userData.province || '',
            localityName: userData.locality || ''
          });
        } else {
          throw new Error('Error al cargar perfil');
        }

        setInitialLoad(false);
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        setMessage({ text: 'Error al cargar los datos del perfil', type: 'error' });
        setInitialLoad(false);
      }
    };

    if (provinces.length > 0) {
      loadUserProfile();
    }
  }, [provinces, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    const provinceName = provinces.find(p => p.id === provinceId)?.nombre || '';

    setFormData(prev => ({
      ...prev,
      selectedProvince: provinceId,
      provinceName: provinceName,
      selectedLocality: '',
      localityName: ''
    }));
  };

  const handleLocalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const localityId = e.target.value;
    const localityName = localities.find(l => l.id === localityId)?.nombre || '';

    setFormData(prev => ({
      ...prev,
      selectedLocality: localityId,
      localityName: localityName
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    if (!formData.name.trim()) {
      setMessage({ text: 'El nombre es obligatorio', type: 'error' });
      setLoading(false);
      return;
    }

    if (!formData.birthDate) {
      setMessage({ text: 'La fecha de nacimiento es obligatoria', type: 'error' });
      setLoading(false);
      return;
    }

    if (!formData.selectedProvince) {
      setMessage({ text: 'Debes seleccionar una provincia', type: 'error' });
      setLoading(false);
      return;
    }

    if (!formData.selectedLocality) {
      setMessage({ text: 'Debes seleccionar una localidad', type: 'error' });
      setLoading(false);
      return;
    }

    const today = new Date();
    const birthDateObj = new Date(formData.birthDate);
    if (birthDateObj > today) {
      setMessage({ text: 'La fecha de nacimiento no puede ser futura', type: 'error' });
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('http://localhost:3000/api/auth/edit-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          birthDate: formData.birthDate,
          province: formData.provinceName,
          locality: formData.localityName
        })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar perfil');
      }

      const result = await response.json();
      setMessage({ text: result.message || 'Perfil actualizado correctamente', type: 'success' });

      setUserProfile(prev => ({
        ...prev,
        name: formData.name
      }));

    } catch (error) {
      console.error('Error:', error);
      setMessage({ text: 'Error al actualizar el perfil. Intenta nuevamente.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoad) {
    return (
      <div className="edit-profile-container">
        <div className="edit-profile-box">
          <div className="loading-container">
            <Loader2 className="loading-spinner" />
            <span className="loading-text">Cargando perfil...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-box">
        <div className="header">
          <User className="header-icon" />
          <h1 className="title">Editar Perfil</h1>
        </div>

        {message.text && (
          <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        <div className="form-container">
          <div className="input-group">
            <label htmlFor="name">
              <User className="label-icon" />
              Nombre completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Ingresa tu nombre completo"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="birthDate">
              <Calendar className="label-icon" />
              Fecha de nacimiento
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="province">
              <MapPin className="label-icon" />
              Provincia
            </label>
            <select
              id="province"
              value={formData.selectedProvince}
              onChange={handleProvinceChange}
              disabled={loadingProvinces}
              required
            >
              <option value="">
                {loadingProvinces ? "Cargando provincias..." : "Selecciona una provincia"}
              </option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="locality">
              <MapPin className="label-icon" />
              Localidad
            </label>
            <select
              id="locality"
              value={formData.selectedLocality}
              onChange={handleLocalityChange}
              disabled={loadingLocalities || !formData.selectedProvince}
              required
            >
              <option value="">
                {loadingLocalities
                  ? "Cargando localidades..."
                  : !formData.selectedProvince
                    ? "Primero selecciona una provincia"
                    : "Selecciona una localidad"
                }
              </option>
              {localities.map((locality) => (
                <option key={locality.id} value={locality.id}>
                  {locality.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate('/home')}
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="submit-btn"
            >
              {loading ? (
                <>
                  <Loader2 className="btn-icon loading-spinner" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="btn-icon" />
                  Guardar cambios
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;