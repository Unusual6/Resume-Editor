import { forwardRef } from 'react';
import { useResume } from '../context/ResumeContext';
import ClassicTemplate from '../templates/ClassicTemplate';
import ModernTemplate from '../templates/ModernTemplate';
import MinimalTemplate from '../templates/MinimalTemplate';
import ElegantTemplate from '../templates/ElegantTemplate';
import ProfessionalTemplate from '../templates/ProfessionalTemplate';
import CreativeTemplate from '../templates/CreativeTemplate';
import CompactTemplate from '../templates/CompactTemplate';

const ResumePreview = forwardRef<HTMLDivElement>((_props, ref) => {
  const { template } = useResume();

  const TemplateComponent = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    elegant: ElegantTemplate,
    professional: ProfessionalTemplate,
    creative: CreativeTemplate,
    compact: CompactTemplate,
  }[template];

  return <TemplateComponent ref={ref} />;
});

export default ResumePreview;
