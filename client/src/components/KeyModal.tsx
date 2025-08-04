import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCopy, faTrash, faEdit, faKey, faGift, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface Key {
    id: string;
    name: string;
    type: 'access' | 'gift' | 'achievement' | 'asset';
    value: string;
    description: string;
    createdAt: string;
    isActive: boolean;
}

interface KeyModalProps {
    selectedKey: Key | null;
    isOpen: boolean;
    onClose: () => void;
    onDelete: (keyId: string) => void;
    onEdit: (key: Key) => void;
}

const KeyModal = ({ selectedKey, isOpen, onClose, onDelete, onEdit }: KeyModalProps) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !selectedKey) return null;

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
            default: return 'from-gray-400 to-gray-600';
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(selectedKey.value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getKeyColor(selectedKey.type)} rounded-lg flex items-center justify-center`}>
                            <FontAwesomeIcon icon={getKeyIcon(selectedKey.type)} className="text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">{selectedKey.name}</h3>
                            <p className="text-sm text-gray-500 capitalize">{selectedKey.type}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Описание
                        </label>
                        <p className="text-gray-600">{selectedKey.description}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Значение ключа
                        </label>
                        <div className="flex items-center space-x-2">
                            <input 
                                type="text" 
                                value={selectedKey.value}
                                readOnly
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                            />
                            <button 
                                onClick={copyToClipboard}
                                className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <FontAwesomeIcon icon={faCopy} />
                            </button>
                        </div>
                        {copied && (
                            <p className="text-sm text-green-600 mt-1">Скопировано!</p>
                        )}
                    </div>

                    <div className="flex justify-between text-sm text-gray-500">
                        <span>Создан: {new Date(selectedKey.createdAt).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                            selectedKey.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                            {selectedKey.isActive ? 'Активен' : 'Неактивен'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 p-6 border-t">
                    <button 
                        onClick={() => onEdit(selectedKey)}
                        className="flex-1 py-2 px-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
                    >
                        <FontAwesomeIcon icon={faEdit} />
                        <span>Редактировать</span>
                    </button>
                    <button 
                        onClick={() => onDelete(selectedKey.id)}
                        className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        <span>Удалить</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default KeyModal; 