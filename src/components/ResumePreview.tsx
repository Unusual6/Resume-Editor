import { forwardRef } from 'react';
import { useResume } from '../context/ResumeContext';
import ClassicTemplate from '../templates/ClassicTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ElegantTemplate from '../templates/ElegantTemplate';

const ResumePreview = forwardRef<HTMLDivElement>((_props, ref) => {
  const { template } = useResume();

  const TemplateComponent = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    elegant: ElegantTemplate,
  }[template];

  return <TemplateComponent ref={ref} />;
});

export default ResumePreview;
