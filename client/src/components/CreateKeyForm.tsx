import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faKey, faGift, faTrophy, faGem } from '@fortawesome/free-solid-svg-icons';

interface Key {
    id: string;
    name: string;
    type: 'access' | 'gift' | 'achievement' | 'asset';
    value: string;
    description: string;
    createdAt: string;
    isActive: boolean;
}

interface CreateKeyFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (keyData: Partial<Key>) => void;
    editingKey?: Key | null;
    isLoading?: boolean;
}

const CreateKeyForm = ({ isOpen, onClose, onSubmit, editingKey, isLoading = false }: CreateKeyFormProps) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'access' as 'access' | 'gift' | 'achievement' | 'asset',
        description: '',
        value: ''
    });

    useEffect(() => {
        if (editingKey) {
            setFormData({
                name: editingKey.name,
                type: editingKey.type,
                description: editingKey.description,
                value: editingKey.value
            });
        } else {
            setFormData({
                name: '',
                type: 'access',
                description: '',
                value: ''
            });
        }
    }, [editingKey]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const generateKeyValue = () => {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 8);
        const newValue = `KEY_${timestamp}_${random}`;
        setFormData(prev => ({ ...prev, value: newValue }));
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'access': return faKey;
            case 'gift': return faGift;
            case 'achievement': return faTrophy;
            case 'asset': return faGem;
            default: return faKey;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'access': return 'from-blue-400 to-blue-600';
            case 'gift': return 'from-green-400 to-green-600';
            case 'achievement': return 'from-yellow-400 to-yellow-600';
            case 'asset': return 'from-purple-400 to-purple-600';
            default: return 'from-gray-400 to-gray-600';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {editingKey ? 'Редактировать ключ' : 'Создать новый ключ'}
                    </h3>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Название ключа *
                        </label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            placeholder="Введите название ключа"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Тип ключа
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['access', 'gift', 'achievement', 'asset'] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type }))}
                                    className={`p-3 rounded-lg border-2 transition-all ${
                                        formData.type === type 
                                            ? `border-yellow-500 bg-gradient-to-br ${getTypeColor(type)} text-white` 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    <FontAwesomeIcon icon={getTypeIcon(type)} className="mr-2" />
                                    <span className="text-sm capitalize">
                                        {type === 'access' && 'Доступ'}
                                        {type === 'gift' && 'Подарок'}
                                        {type === 'achievement' && 'Достижение'}
                                        {type === 'asset' && 'Актив'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Описание
                        </label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            rows={3}
                            placeholder="Описание ключа"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Значение ключа
                        </label>
                        <div className="flex space-x-2">
                            <input 
                                type="text" 
                                value={formData.value}
                                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                placeholder="Значение ключа"
                            />
                            <button 
                                type="button"
                                onClick={generateKeyValue}
                                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Генерировать
                            </button>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2 pt-4">
                        <button 
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Отмена
                        </button>
                        <button 
                            type="submit"
                            disabled={isLoading || !formData.name}
                            className="flex-1 py-2 px-4 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    {editingKey ? 'Сохранение...' : 'Создание...'}
                                </div>
                            ) : (
                                editingKey ? 'Сохранить' : 'Создать'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateKeyForm; 