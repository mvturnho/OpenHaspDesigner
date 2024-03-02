import { createApp } from 'vue'
import App from './App.vue'

import VueKonva from 'vue-konva';

import Button from './components/form/Button.vue'
import Input from './components/form/Input.vue'
import Textarea from './components/form/Textarea.vue'
import Label from './components/form/Label.vue'
import FormGroup from './components/form/FormGroup.vue'
import Select from './components/form/Select.vue'
import Checkbox from './components/form/Checkbox.vue'
import Position from './components/form/Position.vue'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* import specific icons */
import { faPlusCircle, faTrashCan, faUserSecret } from '@fortawesome/free-solid-svg-icons'
/* add icons to the library */
library.add(faUserSecret);
library.add(faPlusCircle);
library.add(faTrashCan);

// import './components';
const app = createApp(App);
app.component("form-button",Button);
app.component("form-input",Input);
app.component("form-textarea",Textarea);
app.component("form-label",Label);
app.component("form-Position",Position);
app.component("form-select",Select);
app.component("form-checkbox", Checkbox);
app.component("form-group",FormGroup);
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(VueKonva);
app.mount('#app');
