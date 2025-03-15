import { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  doc,
  getDoc,
  query,
  where
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { FaCalculator, FaInfoCircle } from 'react-icons/fa';

const InstructorServicesPanel = () => {
  const [services, setServices] = useState([]);
  const [configData, setConfigData] = useState({
    teacherBaseRate: 11500,
    teacherBonusPerStudent: 1000,
    volumeDiscountPerHour: 500
  });
  const [loading, setLoading] = useState(true);
  const [showSimulator, setShowSimulator] = useState(false);
  const [simulatedService, setSimulatedService] = useState(null);
  const [simulatedHours, setSimulatedHours] = useState(1);
  
  // Fetch services and config on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      // Get financial configuration
      const configDocRef = doc(db, 'configuration', 'financial');
      const configDoc = await getDoc(configDocRef);
      
      if (configDoc.exists()) {
        const config = configDoc.data();
        setConfigData({
          teacherBaseRate: config.teacherBaseRate || 11500,
          teacherBonusPerStudent: config.teacherBonusPerStudent || 1000,
          volumeDiscountPerHour: config.volumeDiscountPerHour || 500
        });
      }

      // Get all services
      const servicesCollection = collection(db, 'services');
      const snapshot = await getDocs(servicesCollection);
      
      if (!snapshot.empty) {
        const servicesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setServices(servicesList);
      }
    } catch (error) {
      console.error('Error fetching instructor services:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate instructor payment for a service
  const calculateInstructorPayment = (service, hours = service.hours) => {
    // Base payment per hour
    const basePayment = configData.teacherBaseRate * hours;
    
    // Bonus for additional students
    const studentsBonus = service.students > 1 ? 
      (service.students - 1) * configData.teacherBonusPerStudent * hours : 0;
    
    // Total payment
    const totalPayment = basePayment + studentsBonus;
    
    return {
      basePayment,
      studentsBonus,
      totalPayment
    };
  };

  // Open simulator with a specific service
  const openSimulator = (service) => {
    setSimulatedService(service);
    setSimulatedHours(service.hours);
    setShowSimulator(true);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return amount.toLocaleString('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Servicios Disponibles</h2>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500 text-lg">Cargando servicios...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500 mb-4">Aún no hay servicios disponibles.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Tarifas por Servicio</h3>
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
                      Tarifa Base
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bonificación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total a Cobrar
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {services.map((service) => {
                    const paymentInfo = calculateInstructorPayment(service);
                    return (
                      <tr key={service.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{service.students}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{service.hours}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatCurrency(paymentInfo.basePayment)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {paymentInfo.studentsBonus > 0 
                              ? formatCurrency(paymentInfo.studentsBonus) 
                              : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(paymentInfo.totalPayment)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => openSimulator(service)}
                            className="text-primary hover:text-blue-800 p-1"
                            title="Simular horas"
                          >
                            <FaCalculator />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Horas Simulador */}
          {showSimulator && simulatedService && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Simulador de Horas: {simulatedService.name}</h3>
                <button
                  onClick={() => setShowSimulator(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cantidad de Horas
                  </label>
                  <input
                    type="number"
                    value={simulatedHours}
                    onChange={(e) => setSimulatedHours(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="md:pt-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start">
                    <FaInfoCircle className="text-blue-500 mt-1 mr-2 flex-shrink-0" />
                    <p className="text-sm text-blue-800">
                      Esta simulación es solo para consulta. Los valores reales pueden variar según la configuración vigente al momento de la asignación.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h4 className="font-medium mb-3">Resultados de la Simulación:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Pago base ({formatCurrency(configData.teacherBaseRate)}/hora × {simulatedHours} horas):</p>
                    <p className="text-lg font-medium">
                      {formatCurrency(configData.teacherBaseRate * simulatedHours)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Bonificación por {simulatedService.students > 1 ? (simulatedService.students - 1) + ' alumno(s) extra' : 'alumnos'}:
                    </p>
                    <p className="text-lg font-medium">
                      {simulatedService.students > 1 
                        ? formatCurrency((simulatedService.students - 1) * configData.teacherBonusPerStudent * simulatedHours)
                        : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total a cobrar:</p>
                    <p className="text-xl font-semibold text-primary">
                      {formatCurrency(
                        configData.teacherBaseRate * simulatedHours + 
                        (simulatedService.students > 1 ? 
                          (simulatedService.students - 1) * configData.teacherBonusPerStudent * simulatedHours : 0)
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default InstructorServicesPanel;