import * as Switch from '@radix-ui/react-switch';
import '../src/CSS/switch.css';

export function MySwitch() {
  return (
    <Switch.Root className="SwitchRoot" id="settings-switch">
      <Switch.Thumb className="SwitchThumb" />
    </Switch.Root>
  );
}
