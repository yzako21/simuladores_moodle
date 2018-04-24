<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Defines the editing form for the buscasim question type.
 *
 * @package    qtype
 * @subpackage buscasim
 * @copyright  2007 Jamie Pratt
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();


/**
 * Short answer question editing form definition.
 *
 * @copyright  2007 Jamie Pratt
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class qtype_buscasim_edit_form extends question_edit_form {

    protected function defaultsims(){
        global $CFG;
        global $DB;

        $htmlSim = '
            <script type="text/javascript">  
                var rootDir = "'.$CFG->wwwroot.'";
                
                $(function(){
                    //alert("Default function");
                    initBuscador();
                });  
            </script>
       ';

        return $htmlSim;
    }

    protected function restartsims(){
        global $CFG;
        global $DB;

        $htmlSim = '
            <script type="text/javascript">  
                var rootDir = "'.$CFG->wwwroot.'";
                
                $(function(){
                    //alert("Restart function");
                    initBuscador();
                });  
            </script>
       ';

        return $htmlSim;
    }

    protected function definition_inner($mform) {
        global $CFG;
        global $DB;

        

        $menu = array(
            get_string('caseno', 'qtype_buscasim'),
            get_string('caseyes', 'qtype_buscasim')
        );
        //$mform->addElement('select', 'usecase',
         //       get_string('casesensitive', 'qtype_buscasim'), $menu);

        
         /*
            -IS
            BANDERAS PARA LA CARGA DEL SIMULADOR INICIAL Y SIULADOR RESULTADO
        */        
        $mform->addElement('text', 'keywords',"Palabras Clave"); //keywords db field
        $mform->setType('keywords', PARAM_NOTAGS); //Set type of element
        $mform->setDefault('keywords', '');        //Default value

         $mform->addElement('static', 'cxinstruct',
                get_string('cxins', 'qtype_buscasim'),
                get_string('cxget', 'qtype_buscasim'));

        $mform->addElement('text', 'cw',"Clave CX"); //keywords db field
        $mform->setType('cw', PARAM_NOTAGS); //Set type of element
        $mform->addRule('cw', get_string('cxneed', 'qtype_buscasim'), 'required', null, 'server');
        $mform->setDefault('cw', '');        //Default value

        $mform->addElement('html','
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/buscasim/js/jquery-1.8.3.min.js"/></script>
            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/buscasim/js/jquery-ui.min.js"/></script>

            <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/buscasim/js/rediz.js"/> </script>  

            <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/buscasim/css/jquery-ui.min.css"/>            
            <link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/buscasim/css/base.css"/>
        ');    

        /* -ISE */

         if (!isset($this->question->options)){
            $OpVar ="";
            $mform->addElement('html',$this->defaultsims());    
        }else{
            $OpVar = $this->question->options->keywords;
            $mform->addElement('html',$this->restartsims());
        }

        /*
        //asi estaba en calc_sim
        if ($OpVar == "" || $OpVar == '[{"title":"Hoja 1","rows":[{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]},{"height":"18px","columns":[{},{},{},{},{}]}],"metadata":{"widths":["120px","120px","120px","120px","120px"],"frozenAt":{"row":0,"col":0}}}]'){
            $mform->addElement('html',$this->defaultsims());    
        }
        else{
            $mform->addElement('html',$this->restartsims());
        }*/

        $mform->addElement('static', 'answersinstruct',
                get_string('correctanswers', 'qtype_buscasim'),
                get_string('filloutoneanswer', 'qtype_buscasim'));
        $mform->closeHeaderBefore('answersinstruct');

        $this->add_per_answer_fields($mform, get_string('answerno', 'qtype_buscasim', '{no}'),
                question_bank::fraction_options());

        $this->add_interactive_settings();
    }

    protected function get_more_choices_string() {
        return get_string('addmoreanswerblanks', 'qtype_buscasim');
    }

    protected function data_preprocessing($question) {
        $question = parent::data_preprocessing($question);
        $question = $this->data_preprocessing_answers($question);
        $question = $this->data_preprocessing_hints($question);

        return $question;
    }

    public function validation($data, $files) {
        $errors = parent::validation($data, $files);
        $answers = $data['answer'];
        $answercount = 0;
        $maxgrade = false;
        foreach ($answers as $key => $answer) {
            $trimmedanswer = trim($answer);
            if ($trimmedanswer !== '') {
                $answercount++;
                if ($data['fraction'][$key] == 1) {
                    $maxgrade = true;
                }
            } else if ($data['fraction'][$key] != 0 ||
                    !html_is_blank($data['feedback'][$key]['text'])) {
                $errors["answeroptions[$key]"] = get_string('answermustbegiven', 'qtype_buscasim');
                $answercount++;
            }
        }
        if ($answercount==0) {
            $errors['answeroptions[0]'] = get_string('notenoughanswers', 'qtype_buscasim', 1);
        }
        if ($maxgrade == false) {
            $errors['answeroptions[0]'] = get_string('fractionsnomax', 'question');
        }
        return $errors;
    }

    public function qtype() {
        return 'buscasim';
    }
}
