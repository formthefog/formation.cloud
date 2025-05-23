'use client';

import { useState } from 'react';
import { PricingSettings } from '../app/marketplace/create-agent/types';
import {
  CurrencyDollarIcon,
  PlusIcon,
  TrashIcon,
  TagIcon,
  ChartBarIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

interface PricingFormProps {
  data: PricingSettings;
  onUpdate: (data: PricingSettings) => void;
}

export default function PricingForm({ data, onUpdate }: PricingFormProps) {
  const [newTier, setNewTier] = useState({
    name: '',
    price: '',
    requestLimit: '',
    features: [''],
  });

  const handleUpdateField = <K extends keyof PricingSettings>(
    field: K,
    value: PricingSettings[K]
  ) => {
    onUpdate({
      ...data,
      [field]: value,
    });
  };

  const handleAddTier = () => {
    if (!newTier.name || !newTier.price || !newTier.requestLimit) return;
    handleUpdateField('tiers', [
      ...data.tiers,
      {
        ...newTier,
        price: parseFloat(newTier.price),
        requestLimit: parseInt(newTier.requestLimit),
        features: newTier.features.filter(Boolean),
      },
    ]);
    setNewTier({
      name: '',
      price: '',
      requestLimit: '',
      features: [''],
    });
  };

  const handleRemoveTier = (index: number) => {
    handleUpdateField(
      'tiers',
      data.tiers.filter((_, i) => i !== index)
    );
  };

  const handleAddFeature = () => {
    setNewTier((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const handleUpdateFeature = (index: number, value: string) => {
    setNewTier((prev) => ({
      ...prev,
      features: prev.features.map((f, i) => (i === index ? value : f)),
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setNewTier((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Pricing Configuration</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Set up pricing tiers and billing options for your agent.
        </p>
      </div>

      {/* Pricing Model */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <CurrencyDollarIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Pricing Model</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Billing Type</label>
            <select
              value={data.billingType}
              onChange={(e) => handleUpdateField('billingType', e.target.value as PricingSettings['billingType'])}
              className="input-field"
            >
              <option value="per_request">Per Request</option>
              <option value="subscription">Subscription</option>
              <option value="usage_based">Usage Based</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Billing Cycle
              </label>
              <select
                value={data.billingCycle}
                onChange={(e) => handleUpdateField('billingCycle', e.target.value as PricingSettings['billingCycle'])}
                className="input-field"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="offerTrial"
              checked={data.offerTrial}
              onChange={(e) => handleUpdateField('offerTrial', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="offerTrial" className="text-sm">
              Offer free trial period
            </label>
          </div>

          {data.offerTrial && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Trial Period (days)
              </label>
              <input
                type="number"
                min="1"
                value={data.trialPeriod}
                onChange={(e) =>
                  handleUpdateField('trialPeriod', parseInt(e.target.value))
                }
                className="input-field w-32"
              />
            </div>
          )}
        </div>
      </div>

      {/* Pricing Tiers */}
      <div className="border dark:border-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-4">
          <TagIcon className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Pricing Tiers</h3>
        </div>

        {/* Add New Tier */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tier Name</label>
              <input
                type="text"
                value={newTier.name}
                onChange={(e) =>
                  setNewTier((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="e.g., Basic"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Price (Credits)
              </label>
              <input
                type="text"
                value={newTier.price}
                onChange={(e) =>
                  setNewTier((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="e.g., 100"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Request Limit
              </label>
              <input
                type="text"
                value={newTier.requestLimit}
                onChange={(e) =>
                  setNewTier((prev) => ({
                    ...prev,
                    requestLimit: e.target.value,
                  }))
                }
                placeholder="e.g., 1000"
                className="input-field"
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Features</label>
            {newTier.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleUpdateFeature(index, e.target.value)}
                  placeholder="e.g., 24/7 Support"
                  className="input-field flex-grow"
                />
                <button
                  onClick={() => handleRemoveFeature(index)}
                  className="text-red-400 hover:text-red-500"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddFeature}
              className="text-blue-500 hover:text-blue-600 text-sm flex items-center space-x-1"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Add Feature</span>
            </button>
          </div>

          <button
            onClick={handleAddTier}
            disabled={!newTier.name || !newTier.price || !newTier.requestLimit}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Tier</span>
          </button>
        </div>

        {/* Existing Tiers */}
        {data.tiers.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium">Existing Tiers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.tiers.map((tier, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h5 className="font-medium">{tier.name}</h5>
                      <p className="text-lg font-bold text-blue-600">
                        {tier.price} Credits
                      </p>
                      <p className="text-sm text-gray-500">
                        {tier.requestLimit.toLocaleString()} requests
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveTier(index)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {tier.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="text-sm text-gray-600 dark:text-gray-300 flex items-center space-x-2"
                      >
                        <ChartBarIcon className="h-4 w-4 text-blue-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Pricing Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start">
          <InformationCircleIcon className="h-5 w-5 text-blue-500 mt-0.5" />
          <div className="ml-3">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Pricing Strategy Tips
            </h4>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
              Consider offering a mix of pricing tiers to cater to different user
              needs. Include a free tier to attract new users and premium tiers
              with advanced features for power users. Credits can be purchased separately
              and used across all our services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 