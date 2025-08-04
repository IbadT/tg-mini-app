import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faKey, faGift, faTrophy, faCog, faSignOutAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
import KeyModal from '../components/KeyModal';
import CreateKeyForm from '../components/CreateKeyForm';

interface Key {
    id: string;
    name: string;
    type: 'access' | 'gift' | 'achievement' | 'asset';
    value: string;
    description: string;
    createdAt: string;
    isActive: boolean;
}

const AppLayout = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'vault' | 'create' | 'profile'>('vault');
    const [keys, setKeys] = useState<Key[]>([]);
    const [userName, setUserName] = useState('Пользователь');
    const [selectedKey, setSelectedKey] = useState<Key | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [editingKey, setEditingKey] = useState<Key | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<string>('all');
    const navigate = useNavigate();

    // API hooks (пока отключены для демонстрации)
    // const [getUserKeys, { data: keysData, isLoading: keysLoading }] = keysApi.getUserKeys();
    // const [createKey, { isLoading: createLoading }] = keysApi.createKey();
    // const [deleteKey, { isLoading: deleteLoading }] = keysApi.deleteKey();
    // const [updateKey, { isLoading: updateLoading }] = keysApi.updateKey();
    // const [getUserProfile, { data: profileData }] = keysApi.getUserProfile();

    useEffect(() => {
        // Проверяем токен при загрузке
        const token = sessionStorage.getItem('token');
        if (!token) {
            navigate('/', { replace: true });
            return;
        }

        // Загружаем данные
        loadMockData();
    }, [navigate]);

    const loadMockData = () => {
        const mockKeys: Key[] = [
            {
                id: '1',
                name: 'Доступ к премиум',
                type: 'access',
                value: 'PREMIUM_2024',
                description: 'Премиум доступ на 1 год',
                createdAt: '2024-01-15',
                isActive: true
            },
            {
                id: '2',
                name: 'Подарочный код',
                type: 'gift',
                value: 'GIFT_50OFF',
                description: 'Скидка 50% на все товары',
                createdAt: '2024-01-10',
                isActive: true
            },
            {
                id: '3',
                name: 'Достижение "Первые шаги"',
                type: 'achievement',
                value: 'FIRST_STEPS',
                description: 'Первое достижение в системе',
                createdAt: '2024-01-05',
                isActive: true
            },
            {
                id: '4',
                name: 'NFT коллекция',
                type: 'asset',
                value: 'NFT_COLLECTION_001',
                description: 'Эксклюзивная NFT коллекция',
                createdAt: '2024-01-20',
                isActive: true
            }
        ];
        setKeys(mockKeys);
        setUserName('Александр');
    };

    const handleCreateKey = async (keyData: Partial<Key>) => {
        try {
            setIsLoading(true);
            
            // В реальном приложении здесь был бы API вызов
            // const result = await createKey(keyData).unwrap();
            
            // Для демонстрации создаем локально
            const newKey: Key = {
                id: Date.now().toString(),
                name: keyData.name || 'Новый ключ',
                type: keyData.type || 'access',
                value: keyData.value || `KEY_${Date.now()}`,
                description: keyData.description || 'Автоматически созданный ключ',
                createdAt: new Date().toISOString().split('T')[0],
                isActive: true
            };
            
            setKeys(prev => [...prev, newKey]);
            setIsCreateFormOpen(false);
            setActiveTab('vault');
            
            // Показываем уведомление об успехе
            showNotification('Ключ успешно создан!');
        } catch (error) {
            console.error('Error creating key:', error);
            showNotification('Ошибка при создании ключа');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateKey = async (keyData: Partial<Key>) => {
        if (!editingKey) return;
        
        try {
            setIsLoading(true);
            
            // В реальном приложении здесь был бы API вызов
            // const result = await updateKey({ keyId: editingKey.id, keyData }).unwrap();
            
            // Для демонстрации обновляем локально
            setKeys(prev => prev.map(key => 
                key.id === editingKey.id 
                    ? { ...key, ...keyData }
                    : key
            ));
            
            setIsCreateFormOpen(false);
            setEditingKey(null);
            
            showNotification('Ключ успешно обновлен!');
        } catch (error) {
            console.error('Error updating key:', error);
            showNotification('Ошибка при обновлении ключа');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteKey = async (keyId: string) => {
        if (!confirm('Вы уверены, что хотите удалить этот ключ?')) return;
        
        try {
            setIsLoading(true);
            
            // В реальном приложении здесь был бы API вызов
            // await deleteKey(keyId).unwrap();
            
            // Для демонстрации удаляем локально
            setKeys(prev => prev.filter(key => key.id !== keyId));
            setIsModalOpen(false);
            setSelectedKey(null);
            
            showNotification('Ключ успешно удален!');
        } catch (error) {
            console.error('Error deleting key:', error);
            showNotification('Ошибка при удалении ключа');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyClick = (key: Key) => {
        setSelectedKey(key);
        setIsModalOpen(true);
    };

    const handleEditKey = (key: Key) => {
        setEditingKey(key);
        setIsCreateFormOpen(true);
        setIsModalOpen(false);
    };

    const showNotification = (message: string) => {
        // Простое уведомление через alert (в реальном приложении можно использовать toast)
        alert(message);
    };

    const filteredKeys = keys.filter(key => {
        const matchesSearch = key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            key.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || key.type === filterType;
        return matchesSearch && matchesFilter;
    });

    const getKeyIcon = (type: string) => {
        switch (type) {
            case 'access': return faKey;
            case 'gift': return faGift;
            case 'achievement': return faTrophy;
            default: return faKey;
        }
    };

    const getKeyColor = (type: string) => {
        switch (type) {
            case 'access': return 'from-blue-400 to-blue-600';
            case 'gift': return 'from-green-400 to-green-600';
            case 'achievement': return 'from-yellow-400 to-yellow-600';
            case 'asset': return 'from-purple-400 to-purple-600';
            default: return 'from-gray-400 to-gray-600';
        }
    };

    const renderVault = () => (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Золотое Хранилище
                </h1>
                <p className="text-gray-600">
                    Ваши драгоценные ключи ({filteredKeys.length})
                </p>
            </div>

            {/* Search and Filter */}
            <div className="mb-6 space-y-3">
                <div className="relative">
                    <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Поиск ключей..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                </div>
                
                <div className="flex space-x-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-3 py-1 rounded-full text-sm ${
                            filterType === 'all' 
                                ? 'bg-yellow-500 text-white' 
                                : 'bg-gray-200 text-gray-700'
                        }`}
                    >
                        Все
                    </button>
                    {(['access', 'gift', 'achievement', 'asset'] as const).map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-3 py-1 rounded-full text-sm ${
                                filterType === type 
                                    ? 'bg-yellow-500 text-white' 
                                    : 'bg-gray-200 text-gray-700'
                            }`}
                        >
                            {type === 'access' && 'Доступ'}
                            {type === 'gift' && 'Подарки'}
                            {type === 'achievement' && 'Достижения'}
                            {type === 'asset' && 'Активы'}
                        </button>
                    ))}
                </div>
            </div>

            {filteredKeys.length === 0 ? (
                <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <FontAwesomeIcon icon={faKey} className="text-white text-3xl" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                        {searchTerm || filterType !== 'all' ? 'Ключи не найдены' : 'Хранилище пусто'}
                    </h3>
                    <p className="text-gray-500 mb-4">
                        {searchTerm || filterType !== 'all' 
                            ? 'Попробуйте изменить поиск или фильтр' 
                            : 'Создайте свой первый золотой ключ'
                        }
                    </p>
                    <button 
                        onClick={() => setActiveTab('create')}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all"
                    >
                        Создать ключ
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredKeys.map((key) => (
                        <div 
                            key={key.id}
                            onClick={() => handleKeyClick(key)}
                            className="bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-500 cursor-pointer hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className={`w-12 h-12 bg-gradient-to-br ${getKeyColor(key.type)} rounded-lg flex items-center justify-center`}>
                                        <FontAwesomeIcon icon={getKeyIcon(key.type)} className="text-white text-lg" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{key.name}</h3>
                                        <p className="text-sm text-gray-500">{key.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-400">{key.createdAt}</span>
                                    <div className={`w-3 h-3 rounded-full mt-1 ${key.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderCreate = () => (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Создать ключ
                </h1>
                <p className="text-gray-600">
                    Создайте новый золотой ключ
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Название ключа
                        </label>
                        <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Введите название"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Тип ключа
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500">
                            <option value="access">Доступ</option>
                            <option value="gift">Подарок</option>
                            <option value="achievement">Достижение</option>
                            <option value="asset">Актив</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Описание
                        </label>
                        <textarea 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            rows={3}
                            placeholder="Описание ключа"
                        />
                    </div>

                    <button 
                        onClick={() => setIsCreateFormOpen(true)}
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                Создание...
                            </div>
                        ) : (
                            'Создать ключ'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );

    const renderProfile = () => (
        <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Профиль
                </h1>
                <p className="text-gray-600">
                    Настройки аккаунта
                </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{userName[0]}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">{userName}</h3>
                    <p className="text-gray-500">Пользователь</p>
                </div>

                <div className="border-t pt-4">
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Всего ключей</span>
                        <span className="font-semibold text-yellow-600">{keys.length}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">Активных ключей</span>
                        <span className="font-semibold text-green-600">{keys.filter(k => k.isActive).length}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                        <span className="text-gray-700">По типам:</span>
                    </div>
                    <div className="space-y-1 ml-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Доступы</span>
                            <span className="text-sm font-medium">{keys.filter(k => k.type === 'access').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Подарки</span>
                            <span className="text-sm font-medium">{keys.filter(k => k.type === 'gift').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Достижения</span>
                            <span className="text-sm font-medium">{keys.filter(k => k.type === 'achievement').length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Активы</span>
                            <span className="text-sm font-medium">{keys.filter(k => k.type === 'asset').length}</span>
                        </div>
                    </div>
                </div>

                <button 
                    onClick={() => {
                        sessionStorage.removeItem('token');
                        navigate('/', { replace: true });
                    }}
                    className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all flex items-center justify-center"
                >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Выйти
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white shadow-sm border-b px-4 py-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Golden Key Vault
                    </h2>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{userName}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {activeTab === 'vault' && renderVault()}
            {activeTab === 'create' && renderCreate()}
            {activeTab === 'profile' && renderProfile()}

            {/* Bottom Navigation */}
            <div className="bg-white border-t px-4 py-2">
                <div className="flex justify-around">
                    <button 
                        onClick={() => setActiveTab('vault')}
                        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
                            activeTab === 'vault' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500'
                        }`}
                    >
                        <FontAwesomeIcon icon={faKey} className="text-lg mb-1" />
                        <span className="text-xs">Хранилище</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('create')}
                        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
                            activeTab === 'create' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500'
                        }`}
                    >
                        <FontAwesomeIcon icon={faPlus} className="text-lg mb-1" />
                        <span className="text-xs">Создать</span>
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all ${
                            activeTab === 'profile' ? 'text-yellow-600 bg-yellow-50' : 'text-gray-500'
                        }`}
                    >
                        <FontAwesomeIcon icon={faCog} className="text-lg mb-1" />
                        <span className="text-xs">Профиль</span>
                    </button>
                </div>
            </div>

            {/* Modals */}
            <KeyModal
                selectedKey={selectedKey}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedKey(null);
                }}
                onDelete={handleDeleteKey}
                onEdit={handleEditKey}
            />

            <CreateKeyForm
                isOpen={isCreateFormOpen}
                onClose={() => {
                    setIsCreateFormOpen(false);
                    setEditingKey(null);
                }}
                onSubmit={editingKey ? handleUpdateKey : handleCreateKey}
                editingKey={editingKey}
                isLoading={isLoading}
            />
        </div>
    );
};

export default AppLayout;