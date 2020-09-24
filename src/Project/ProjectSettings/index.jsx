import React, {useState} from 'react';
import { connect } from 'react-redux';
import { updateInfo } from '../../redux/actions/index';

import { ProjectCategory, ProjectCategoryCopy } from '../../shared/constants/projects';
import notify from '../../shared/utils/notify';
import Form from '../../shared/components/Form';
import Breadcrumbs from '../../shared/components/Breadcrumbs';

import { FormCont, FormHeading, FormElement, ActionButton } from './Styles';


const ProjectSettings = ({ project, updateInfo }) => {
  const [isUpdating, setUpdating] = useState(false);

  return (
    <Form
      initialValues={{
        name: project.name,
        url: project.url,
        category: project.category,
        description: project.description,
      }}
      validations={{
        name: [Form.is.required(), Form.is.maxLength(100)],
        url: Form.is.url(),
        category: Form.is.required(),
      }}
      onSubmit={async (values, form) => {
          setUpdating(true);
          await updateInfo(values);
          setUpdating(false);
          notify.success('Changes have been saved successfully.');
      }}
    >
      <FormCont>
        <FormElement>
          <Breadcrumbs items={['Projects', project.name, 'Project Details']} />
          <FormHeading>Project Details</FormHeading>

          <Form.Field.Input name="name" label="Name" />
          <Form.Field.Input name="url" label="URL" />
          <Form.Field.TextEditor
            name="description"
            label="Description"
            tip="Describe the project in as much detail as you'd like."
          />
          <Form.Field.Select name="category" label="Project Category" options={categoryOptions} />

          <ActionButton type="submit" variant="primary" isWorking={isUpdating}>
            Save changes
          </ActionButton>
        </FormElement>
      </FormCont>
    </Form>
  );
};

const categoryOptions = Object.values(ProjectCategory).map(category => ({
  value: category,
  label: ProjectCategoryCopy[category],
}));

const mapStateToProps = state => {
    return {
        project: state.project
    }
}

export default connect(mapStateToProps, {updateInfo})(ProjectSettings);
