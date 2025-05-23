import { useAuth } from "@/components/auth-provider";
import { Label } from "@/components/ui/label";
import { BoltIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";

export const AutoTopupCard = ({
  autoTopupEnabled,
  setAutoTopupEnabled,
  autoTopupThreshold,
  setAutoTopupThreshold,
  autoTopupAmount,
  setAutoTopupAmount,
  handleSaveAutoTopup,
  loading,
  autoTopupSaved,
}: {
  autoTopupEnabled: boolean;
  setAutoTopupEnabled: (enabled: boolean) => void;
  autoTopupThreshold: number;
  setAutoTopupThreshold: (threshold: number) => void;
  autoTopupAmount: number;
  setAutoTopupAmount: (amount: number) => void;
  handleSaveAutoTopup: () => void;
  loading: boolean;
  autoTopupSaved: boolean;
}) => {
  const { account } = useAuth();
  const [dirty, setDirty] = useState(false);
  const [localEnabled, setLocalEnabled] = useState(autoTopupEnabled);
  const [localThreshold, setLocalThreshold] = useState(autoTopupThreshold);
  const [localAmount, setLocalAmount] = useState(autoTopupAmount);

  useEffect(() => {
    setLocalEnabled(autoTopupEnabled);
    setLocalThreshold(autoTopupThreshold);
    setLocalAmount(autoTopupAmount);
    setDirty(false);
  }, [autoTopupEnabled, autoTopupThreshold, autoTopupAmount]);

  useEffect(() => {
    if (
      localEnabled !== autoTopupEnabled ||
      localThreshold !== autoTopupThreshold ||
      localAmount !== autoTopupAmount
    ) {
      setDirty(true);
    } else {
      setDirty(false);
    }
  }, [
    localEnabled,
    localThreshold,
    localAmount,
    autoTopupEnabled,
    autoTopupThreshold,
    autoTopupAmount,
  ]);

  const handleSave = () => {
    setAutoTopupEnabled(localEnabled);
    setAutoTopupThreshold(localThreshold);
    setAutoTopupAmount(localAmount);
    handleSaveAutoTopup();
  };

  return (
    <div className="mt-8">
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-blue-100 shadow-md p-6 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <BoltIcon className="w-6 h-6 text-blue-500" />
            <span className="font-semibold text-lg text-blue-900">
              Auto Top-Up
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-blue-900 font-medium">Enable</span>
            <Switch
              checked={localEnabled}
              onCheckedChange={setLocalEnabled}
              disabled={!account?.stripe_customer_id || loading}
            />
          </div>
        </div>
        <p className="text-sm text-blue-700 mb-2">
          Never run out of credits! Set a threshold and top-up amount for
          automatic refills.
        </p>
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-end justify-between">
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Label className="text-sm text-blue-900">Threshold</Label>
            <div className="flex items-center gap-2">
              <Input
                disabled={!localEnabled || !account?.stripe_customer_id}
                type="number"
                min={1000}
                value={localThreshold}
                onChange={(e) => setLocalThreshold(Number(e.target.value))}
                className="w-28 border-blue-200 text-center"
              />
              <span className="text-xs text-blue-700">credits</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <Label className="text-sm text-blue-900">Top-Up Amount</Label>
            <div className="flex items-center gap-2">
              <Input
                disabled={!localEnabled || !account?.stripe_customer_id}
                type="number"
                min={1000}
                value={localAmount}
                onChange={(e) => setLocalAmount(Number(e.target.value))}
                className="w-28 border-blue-200 text-center"
              />
              <span className="text-xs text-blue-700">credits</span>
            </div>
          </div>
          <Button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-8 py-2 transition-all duration-150 shadow"
            onClick={handleSave}
            disabled={loading || !dirty}
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
        {autoTopupSaved && (
          <div className="flex items-center gap-2 mt-2 text-green-700">
            <CheckCircleIcon className="w-5 h-5" />
            <span className="text-sm">
              Auto top-up <b>{autoTopupEnabled ? "enabled" : "disabled"}</b>:
              {autoTopupEnabled && (
                <>
                  {" when credits drop below "}
                  <b>{autoTopupThreshold}</b>, <b>{autoTopupAmount}</b> credits
                  will be added automatically.
                </>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
