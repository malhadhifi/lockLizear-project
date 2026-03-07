import Input from '../../../components/common/Input';
import Textarea from '../../../components/common/Textarea';
import Button from '../../../components/common/Button';

const PublicationForm = ({ onSubmit }) => {
  return (
    <form className="space-y-4">
      <Input label="العنوان" />
      <Textarea label="الوصف" />
      <Button type="submit">حفظ</Button>
    </form>
  );
};

export default PublicationForm;
