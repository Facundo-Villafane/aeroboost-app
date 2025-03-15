import { useState, useEffect } from 'react';
    import { FaPlus, FaEdit, FaTrash, FaSave, FaCalculator } from 'react-icons/fa';
    import { 
      collection, 
      getDocs, 
      addDoc, 
      doc, 
      deleteDoc, 
      updateDoc,
      getDoc,
      query,
      where
    } from 'firebase/firestore';
    import { db, auth } from '../firebase';
    
    const FinancialModel = () => {
      // Estados para control de UI
      const [loading, setLoading] = useState(true);
      const [isFounder, setIsFounder] = useState(false);
      const [services, setServices] = useState([]);
      const [editMode, setEditMode] = useState(false);
      const [editingService, setEditingService] = useState(null);
      
      // Estados para la configuración del modelo
      const [teacherPercentage, setTeacherPercentage] = useState(90);
      const [aeroboostPercentage, setAeroboostPercentage] = useState(10);
      const [teacherBaseRate, setTeacherBaseRate] = useState(11500);
      const [teacherBonusPerStudent, setTeacherBonusPerStudent] = useState(1000);
      const [volumeDiscountPerHour, setVolumeDiscountPerHour] = useState(500);
      
      // Estados para nuevo servicio o simulador
      const [showSimulator, setShowSimulator] = useState(false);
      const [newService, setNewService] = useState({
        name: '',
        students: 1,
        hours: 1,
        pricePerStudent: 0,
        teacherCostPerHour: 0
      });
    
      // Comprobar si el usuario tiene rol 'founder'
      useEffect(() => {
        checkFounderRole();
        fetchServices();
      }, []);
    
      const checkFounderRole = async () => {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            // Primero intenta buscar el documento donde el ID es el UID del usuario
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setIsFounder(userData.role === 'founder');
            } else {
              // Si no existe un documento con ese ID, intenta buscar donde uid == currentUser.uid
              const userDocs = await getDocs(
                query(collection(db, 'users'), where('uid', '==', currentUser.uid))
              );
              
              if (!userDocs.empty) {
                const userData = userDocs.docs[0].data();
                setIsFounder(userData.role === 'founder');
              }
            }
          }
        } catch (error) {
          console.error('Error al verificar rol:', error);
        }
      };
    
      const fetchServices = async () => {
        setLoading(true);
        try {
          const servicesCollection = collection(db, 'services');
          const snapshot = await getDocs(servicesCollection);
          
          if (snapshot.empty) {
            // Si no hay servicios, simplemente establecemos la lista como vacía
            setServices([]);
          } else {
            const servicesList = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setServices(servicesList);
          }
          
          // Obtener configuración
          const configDocRef = doc(db, 'configuration', 'financial');
          const configDoc = await getDoc(configDocRef);
          
          if (configDoc.exists()) {
            const configData = configDoc.data();
            setTeacherPercentage(configData.teacherPercentage || 90);
            setAeroboostPercentage(configData.aeroboostPercentage || 10);
            setTeacherBaseRate(configData.teacherBaseRate || 11500);
            setTeacherBonusPerStudent(configData.teacherBonusPerStudent || 1000);
            setVolumeDiscountPerHour(configData.volumeDiscountPerHour || 500);
          } else {
            // Crear configuración por defecto
            await updateDoc(configDocRef, {
              teacherPercentage: 90,
              aeroboostPercentage: 10,
              teacherBaseRate: 11500,
              teacherBonusPerStudent: 1000,
              volumeDiscountPerHour: 500
            }, { merge: true });
          }
        } catch (error) {
          console.error('Error al cargar servicios:', error);
        } finally {
          setLoading(false);
        }
      };
    
      // Ya no creamos servicios por defecto
      const setupDefaultServices = async () => {
        // Esta función ya no crea servicios por defecto
        console.log('No se crearán servicios por defecto');
        return;
      };
    
      const handleUpdateConfig = async () => {
        try {
          const configDocRef = doc(db, 'configuration', 'financial');
          await updateDoc(configDocRef, {
            teacherPercentage: teacherPercentage,
            aeroboostPercentage: aeroboostPercentage,
            teacherBaseRate: teacherBaseRate,
            teacherBonusPerStudent: teacherBonusPerStudent,
            volumeDiscountPerHour: volumeDiscountPerHour
          }, { merge: true });
          
          alert('Configuración actualizada correctamente');
        } catch (error) {
          console.error('Error al actualizar configuración:', error);
          alert('Error al actualizar configuración');
        }
      };
    
      const handleEditService = (service) => {
        setEditingService(service);
        setEditMode(true);
      };
    
      const handleSaveService = async () => {
        try {
          const serviceDocRef = doc(db, 'services', editingService.id);
          await updateDoc(serviceDocRef, {
            name: editingService.name,
            students: Number(editingService.students),
            hours: Number(editingService.hours),
            pricePerStudent: Number(editingService.pricePerStudent)
          });
          
          setEditMode(false);
          setEditingService(null);
          fetchServices();
          
          alert('Servicio actualizado correctamente');
        } catch (error) {
          console.error('Error al actualizar servicio:', error);
          alert('Error al actualizar servicio');
        }
      };
    
      const handleDeleteService = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
          try {
            await deleteDoc(doc(db, 'services', id));
            setServices(services.filter(service => service.id !== id));
            alert('Servicio eliminado correctamente');
          } catch (error) {
            console.error('Error al eliminar servicio:', error);
            alert('Error al eliminar servicio');
          }
        }
      };
    
      const handleAddService = async () => {
        try {
          // Validar campos
          if (!newService.name || newService.pricePerStudent <= 0) {
            alert('Por favor complete todos los campos correctamente');
            return;
          }
          
          const servicesCollection = collection(db, 'services');
          await addDoc(servicesCollection, {
            name: newService.name,
            students: Number(newService.students),
            hours: Number(newService.hours),
            pricePerStudent: Number(newService.pricePerStudent)
          });
          
          // Limpiar formulario
          setNewService({
            name: '',
            students: 1,
            hours: 1,
            pricePerStudent: 0,
            teacherCostPerHour: 0
          });
          
          // Ocultar simulador
          setShowSimulator(false);
          
          // Refrescar lista
          fetchServices();
          
          alert('Servicio agregado correctamente');
        } catch (error) {
          console.error('Error al agregar servicio:', error);
          alert('Error al agregar servicio');
        }
      };
    
      // Cálculo basado en la nueva dinámica
      const calculateServiceStats = (service) => {
        // Calcular pago base al profesor
        const baseTeacherPayment = teacherBaseRate * service.hours;
        
        // Calcular bonificación por estudiantes adicionales
        const studentsBonus = service.students > 1 ? 
          (service.students - 1) * teacherBonusPerStudent * service.hours : 0;
        
        // Pago total al profesor
        const teacherPayment = baseTeacherPayment + studentsBonus;
        
        // Descuento por volumen de horas si es más de 1 hora
        const hourlyDiscount = service.hours > 1 ? 
          (service.hours - 1) * volumeDiscountPerHour : 0;
        
        // Precio ajustado por alumno teniendo en cuenta el descuento
        const adjustedPricePerStudent = service.pricePerStudent - (hourlyDiscount / service.students);
        
        // Ingresos totales
        const totalRevenue = service.students * adjustedPricePerStudent * service.hours;
        
        // Ganancia para AeroBoost
        const aeroboostProfit = totalRevenue - teacherPayment;
        
        // Porcentaje de ganancia
        const profitPercentage = (aeroboostProfit / totalRevenue) * 100;
        
        return {
          totalRevenue,
          teacherPayment,
          aeroboostProfit,
          profitPercentage,
          adjustedPricePerStudent,
          baseTeacherPayment,
          studentsBonus,
          hourlyDiscount
        };
      };
    
      // Cálculo para el simulador con la nueva dinámica
      const calculateSimulatedStats = () => {
        const students = parseInt(newService.students) || 1;
        const hours = parseInt(newService.hours) || 1;
        const inputPrice = parseFloat(newService.pricePerStudent) || 0;
        
        // Calcular pago base al profesor
        const baseTeacherPayment = teacherBaseRate * hours;
        
        // Calcular bonificación por estudiantes adicionales
        const studentsBonus = students > 1 ? 
          (students - 1) * teacherBonusPerStudent * hours : 0;
        
        // Pago total al profesor
        const teacherPayment = baseTeacherPayment + studentsBonus;
        
        // Descuento por volumen de horas si es más de 1 hora
        const hourlyDiscount = hours > 1 ? 
          (hours - 1) * volumeDiscountPerHour : 0;
        
        if (inputPrice > 0) {
          // Si el usuario ingresó un precio, calculamos los resultados basados en ese precio
          const adjustedPricePerStudent = inputPrice - (hourlyDiscount / students);
          const totalRevenue = students * adjustedPricePerStudent * hours;
          const profit = totalRevenue - teacherPayment;
          const actualProfitPercentage = (profit / totalRevenue) * 100;
          
          return {
            calculatedPrice: inputPrice,
            roundedPrice: inputPrice,
            totalRevenue: totalRevenue,
            teacherPayment: teacherPayment,
            profit: profit,
            actualProfitPercentage: actualProfitPercentage,
            baseTeacherPayment: baseTeacherPayment,
            studentsBonus: studentsBonus,
            hourlyDiscount: hourlyDiscount
          };
        } else {
          // Si no hay precio ingresado, calculamos el precio necesario para lograr el % de ganancia deseado
          const desiredProfitPercentage = aeroboostPercentage;
          
          // Calculamos el precio para lograr el % de ganancia deseado
          const totalTeacherPayment = teacherPayment;
          
          // El precio debe ser tal que: (totalRevenue - totalTeacherPayment) / totalRevenue = desiredProfitPercentage/100
          // Despejando: totalRevenue = totalTeacherPayment / (1 - desiredProfitPercentage/100)
          const targetTotalRevenue = totalTeacherPayment / (1 - (desiredProfitPercentage/100));
          
          // Precio por alumno sin descuento
          const calculatedPrice = targetTotalRevenue / (students * hours);
          
          // Precio redondeado al 500 más cercano
          const roundedPrice = Math.ceil(calculatedPrice / 500) * 500;
          
          // Recalcular con el precio redondeado
          const adjustedPricePerStudent = roundedPrice - (hourlyDiscount / students);
          const totalRevenue = students * adjustedPricePerStudent * hours;
          const profit = totalRevenue - teacherPayment;
          const actualProfitPercentage = (profit / totalRevenue) * 100;
          
          return {
            calculatedPrice: calculatedPrice,
            roundedPrice: roundedPrice,
            totalRevenue: totalRevenue,
            teacherPayment: teacherPayment,
            profit: profit,
            actualProfitPercentage: actualProfitPercentage,
            baseTeacherPayment: baseTeacherPayment,
            studentsBonus: studentsBonus,
            hourlyDiscount: hourlyDiscount
          };
        }
      };
    
      const handleSimulatorChange = (e) => {
        const { name, value } = e.target;
        setNewService(prev => ({
          ...prev,
          [name]: value
        }));
      };
    
      const applySimulatedPrice = () => {
        const stats = calculateSimulatedStats();
        setNewService(prev => ({
          ...prev,
          pricePerStudent: stats.roundedPrice
        }));
      };
    
      // Si el usuario no es fundador, mostrar mensaje de acceso denegado
      if (!isFounder) {
        return (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceso Restringido</h2>
            <p className="text-gray-600 mb-6">Esta sección está disponible solo para administradores con rol de fundador.</p>
          </div>
        );
      }
    
      return (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Modelo Financiero</h2>
            <button
              onClick={() => setShowSimulator(!showSimulator)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
            >
              {showSimulator ? 'Ocultar Simulador' : <><FaPlus className="mr-2" /> Nuevo Servicio</>}
            </button>
          </div>
    
          {/* Configuración del modelo */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Configuración del Modelo</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porcentaje para profesores (%)
                </label>
                <input
                  type="number"
                  value={teacherPercentage}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setTeacherPercentage(value);
                    setAeroboostPercentage(100 - value);
                  }}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Porcentaje para AeroBoost (%)
                </label>
                <input
                  type="number"
                  value={aeroboostPercentage}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setAeroboostPercentage(value);
                    setTeacherPercentage(100 - value);
                  }}
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarifa base profesor ($/hora)
                </label>
                <input
                  type="number"
                  value={teacherBaseRate}
                  onChange={(e) => setTeacherBaseRate(Number(e.target.value))}
                  min="0"
                  step="500"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bonificación por alumno extra ($/alumno)
                </label>
                <input
                  type="number"
                  value={teacherBonusPerStudent}
                  onChange={(e) => setTeacherBonusPerStudent(Number(e.target.value))}
                  min="0"
                  step="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descuento por hora adicional ($/hora)
                </label>
                <input
                  type="number"
                  value={volumeDiscountPerHour}
                  onChange={(e) => setVolumeDiscountPerHour(Number(e.target.value))}
                  min="0"
                  step="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div className="mt-4 text-right">
              <button
                onClick={handleUpdateConfig}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Guardar Configuración
              </button>
            </div>
          </div>
    
          {/* Simulador para nuevo servicio */}
          {showSimulator && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Simulador de Nuevo Servicio</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Servicio
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newService.name}
                    onChange={handleSimulatorChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    placeholder="Ej: Tutoría Grupal (3 alumnos)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Alumnos
                  </label>
                  <input
                    type="number"
                    name="students"
                    value={newService.students}
                    onChange={handleSimulatorChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Horas del Servicio
                  </label>
                  <input
                    type="number"
                    name="hours"
                    value={newService.hours}
                    onChange={handleSimulatorChange}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio por Alumno
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="pricePerStudent"
                      value={newService.pricePerStudent}
                      onChange={handleSimulatorChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                    />
                    <button
                      onClick={applySimulatedPrice}
                      className="ml-2 px-3 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                      title="Calcular precio sugerido"
                    >
                      <FaCalculator />
                    </button>
                  </div>
                </div>
              </div>
    
              {/* Resultados de la simulación */}
              {newService.students > 0 && newService.hours > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                  <h4 className="font-medium mb-3">Resultados del Cálculo:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Precio calculado por alumno:</p>
                      <p className="text-lg font-medium">${calculateSimulatedStats().calculatedPrice.toLocaleString('es-CL', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Precio sugerido (redondeado):</p>
                      <p className="text-lg font-medium">${calculateSimulatedStats().roundedPrice.toLocaleString('es-CL', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Descuento por horas adicionales:</p>
                      <p className="text-lg font-medium">${calculateSimulatedStats().hourlyDiscount.toLocaleString('es-CL', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total cobrado (todos los alumnos):</p>
                      <p className="text-lg font-medium">${calculateSimulatedStats().totalRevenue.toLocaleString('es-CL', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pago base al profesor:</p>
                      <p className="text-lg font-medium">${calculateSimulatedStats().baseTeacherPayment.toLocaleString('es-CL', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Bonificación por alumnos extra:</p>
                      <p className="text-lg font-medium">${calculateSimulatedStats().studentsBonus.toLocaleString('es-CL', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Pago total al profesor:</p>
                      <p className="text-lg font-medium">${calculateSimulatedStats().teacherPayment.toLocaleString('es-CL', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Ganancia para AeroBoost:</p>
                      <p className="text-lg font-medium">${calculateSimulatedStats().profit.toLocaleString('es-CL', {minimumFractionDigits: 0, maximumFractionDigits: 0})}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Porcentaje de ganancia real:</p>
                      <p className="text-lg font-medium">{calculateSimulatedStats().actualProfitPercentage.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              )}
    
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowSimulator(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors mr-3"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddService}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Guardar Servicio
                </button>
              </div>
            </div>
          )}
    
          {/* Tabla de servicios */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Servicios y Tarifas</h3>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-500 text-lg">Cargando servicios...</p>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">Aún no hay servicios calculados.</p>
                <button
                  onClick={() => setShowSimulator(true)}
                  className="px-6 py-3 bg-primary text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Agregar primer servicio
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Servicio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Alumnos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Horas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tarifa por Alumno
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Descuento/hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total Cobrado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pago Profesor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ganancia AeroBoost
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        % Ganancia
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => {
                      const stats = calculateServiceStats(service);
                      
                      return (
                        <tr key={service.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editMode && editingService?.id === service.id ? (
                              <input
                                type="text"
                                value={editingService.name}
                                onChange={(e) => setEditingService({...editingService, name: e.target.value})}
                                className="px-2 py-1 border border-gray-300 rounded-md w-full"
                              />
                            ) : (
                              <div className="text-sm font-medium text-gray-900">{service.name}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editMode && editingService?.id === service.id ? (
                              <input
                                type="number"
                                value={editingService.students}
                                onChange={(e) => setEditingService({...editingService, students: e.target.value})}
                                className="px-2 py-1 border border-gray-300 rounded-md w-20"
                                min="1"
                              />
                            ) : (
                              <div className="text-sm text-gray-500">{service.students}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editMode && editingService?.id === service.id ? (
                              <input
                                type="number"
                                value={editingService.hours}
                                onChange={(e) => setEditingService({...editingService, hours: e.target.value})}
                                className="px-2 py-1 border border-gray-300 rounded-md w-20"
                                min="1"
                              />
                            ) : (
                              <div className="text-sm text-gray-500">{service.hours}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editMode && editingService?.id === service.id ? (
                              <input
                                type="number"
                                value={editingService.pricePerStudent}
                                onChange={(e) => setEditingService({...editingService, pricePerStudent: e.target.value})}
                                className="px-2 py-1 border border-gray-300 rounded-md w-28"
                                min="0"
                              />
                            ) : (
                              <div className="text-sm text-gray-500">${service.pricePerStudent.toLocaleString('es-CL')}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              ${stats.hourlyDiscount > 0 ? stats.hourlyDiscount.toLocaleString('es-CL') : '-'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              ${stats.totalRevenue.toLocaleString('es-CL')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              ${stats.teacherPayment.toLocaleString('es-CL')}
                              {stats.studentsBonus > 0 && (
                                <span className="text-xs text-green-600 block">
                                  +${stats.studentsBonus.toLocaleString('es-CL')}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 font-medium">
                              ${stats.aeroboostProfit.toLocaleString('es-CL')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              stats.profitPercentage < 5 ? 'bg-red-100 text-red-800' : 
                              stats.profitPercentage < 10 ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-green-100 text-green-800'
                            }`}>
                              {stats.profitPercentage.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {editMode && editingService?.id === service.id ? (
                              <>
                                <button
                                  onClick={handleSaveService}
                                  className="text-green-600 hover:text-green-900 p-1 mr-2"
                                  title="Guardar"
                                >
                                  <FaSave />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditMode(false);
                                    setEditingService(null);
                                  }}
                                  className="text-gray-600 hover:text-gray-900 p-1"
                                  title="Cancelar"
                                >
                                  <FaTimes />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleEditService(service)}
                                  className="text-blue-600 hover:text-blue-900 p-1 mr-2"
                                  title="Editar"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteService(service.id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Eliminar"
                                >
                                  <FaTrash />
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-right font-semibold">
                        TOTALES:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        ${services.reduce((sum, service) => {
                           const stats = calculateServiceStats(service);
                           return sum + stats.totalRevenue;
                         }, 0).toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        ${services.reduce((sum, service) => {
                           const stats = calculateServiceStats(service);
                           return sum + stats.teacherPayment;
                         }, 0).toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        ${services.reduce((sum, service) => {
                          const stats = calculateServiceStats(service);
                          return sum + stats.aeroboostProfit;
                        }, 0).toLocaleString('es-CL')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">
                        {(() => {
                          const totalRevenue = services.reduce((sum, service) => {
                            const stats = calculateServiceStats(service);
                            return sum + stats.totalRevenue;
                          }, 0);
                          const totalProfit = services.reduce((sum, service) => {
                            const stats = calculateServiceStats(service);
                            return sum + stats.aeroboostProfit;
                          }, 0);
                          return totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) + '%' : '0%';
                        })()}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>
        </div>
      );
    };
    
    export default FinancialModel;