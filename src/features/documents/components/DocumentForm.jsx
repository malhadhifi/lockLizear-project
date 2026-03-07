import Input from '../../../components/common/Input';
import Textarea from '../../../components/common/Textarea';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';

const DocumentForm = ({ onSubmit }) => {
  return (
    <form className="space-y-4">
      <Input label="العنوان" />
      <Textarea label="الوصف" />
      <Select label="النوع" options={[]} />
      <Button type="submit">حفظ</Button>
    </form>
  );
};

export default DocumentForm;
