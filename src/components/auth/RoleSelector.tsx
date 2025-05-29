
import React from 'react';
import { Building, Camera, Users } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface Role {
  id: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
}

interface RoleSelectorProps {
  selectedRole: string;
  onRoleSelect: (roleId: string) => void;
}

const roles: Role[] = [
  {
    id: 'broker',
    icon: Building,
    title: 'Makler',
    description: 'Immobilienvermarktung'
  },
  {
    id: 'architect',
    icon: Users,
    title: 'Architekt',
    description: 'Architekturvisualisierung'
  },
  {
    id: 'photographer',
    icon: Camera,
    title: 'Fotograf',
    description: 'Immobilienfotografie'
  }
];

const RoleSelector = ({ selectedRole, onRoleSelect }: RoleSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Ihre Rolle</Label>
      <div className="grid grid-cols-1 gap-2">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onRoleSelect(role.id)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                selectedRole === role.id
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Icon className="w-5 h-5 text-primary" />
              <div className="text-left">
                <div className="font-medium">{role.title}</div>
                <div className="text-sm text-muted-foreground">{role.description}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoleSelector;
