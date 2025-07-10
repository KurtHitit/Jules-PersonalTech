import React, { useState, PropsWithChildren } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface CollapsibleSectionProps {
  title: string;
}

const CollapsibleSection: React.FC<PropsWithChildren<CollapsibleSectionProps>> = ({
  title,
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View className="mb-2 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
      <TouchableOpacity
        className="flex-row justify-between items-center p-3 bg-neutral-100 dark:bg-neutral-800"
        onPress={toggleCollapsed}
      >
        <Text className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
          {title}
        </Text>
        <Text className="text-lg text-neutral-600 dark:text-neutral-400">
          {isCollapsed ? '▼' : '▲'}
        </Text>
      </TouchableOpacity>
      {!isCollapsed && (
        <View className="p-3 bg-white dark:bg-neutral-900">
          {children}
        </View>
      )}
    </View>
  );
};

export default CollapsibleSection;
