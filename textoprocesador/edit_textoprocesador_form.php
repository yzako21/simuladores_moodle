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
 * Defines the editing form for the shortanswer question type.
 *
 * @package    qtype
 * @subpackagetextoprocesador
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */


defined('MOODLE_INTERNAL') || die();

//require_once($CFG->dirroot . '/question/type/textoprocesador/simplehtml_form.php');

class qtype_textoprocesador_edit_form extends question_edit_form {

	protected function defaultsims(){
        	global $CFG;
	        global $DB;

	        $htmlSim = '
	            <script type="text/javascript">
	                var rootDir = "'.$CFG->wwwroot.'";
	                var answerString = "";
	                var previewRender = false;

	                $(function(){
	                    alert("Recuerda tener espacios disponibles para respuesta antes de modificar y crear una nueva respuesta.");
	                    inittextSim();
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
            	var previewRender = false;
                var rootDir = "'.$CFG->wwwroot.'";
                var answerString = "";

                $(function(){
                    alert("Recuerda generar una nueva respuesta");
                    //inittextSim();
                });
            </script>
       ';


        return $htmlSim;
  }

    protected function definition_inner($mform) {
        global $CFG;
	    	global $DB;

	   /*
	            -IS
	            BANDERAS PARA LA CARGA DEL Establecer simulador inicial Y SIULADOR RESULTADO


		//Primera forma
		$mform->addElement('text', 'initsim',"Datos iniciales Establecer simulador inicial"); //textosAtto db field
	    $mform->setType('initsim', PARAM_NOTAGS);     //Set type of element
	    $mform->setDefault('initsim', '<->');          //Default value

		//Segunda forma
		$mform->addElement('text', 'resultsim',"Datos iniciales simulador resultado"); //textosAtto db field
	    $mform->setType('resultsim', PARAM_NOTAGS);   //Set type of element
	    $mform->setDefault('resultsim', '');        //Default value
	*/

	    $menu = array(
            get_string('caseno', 'qtype_textoprocesador'),
            get_string('caseyes', 'qtype_textoprocesador')
	        );
           /*$mform->addElement('select', 'usecase',
                get_string('casesensitive', 'qtype_textoprocesador'), $menu);*/

		$mform->addElement('html','
			<script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/textoprocesador/js/jquery-1.8.3.min.js"/></script>
        	<script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/textoprocesador/js/jquery-ui.min.js"/></script>

			<script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/textoprocesador/js/jquery.bpopup.min.js"/> </script>
			<!--script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/textoprocesador/js/html2canvas.js"/> </script-->

		    <script type="text/javascript" src="'.$CFG->wwwroot.'/question/type/textoprocesador/js/rediz.js"/> </script>

			<link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/textoprocesador/css/jquery-ui.min.css"/>
			<link rel="stylesheet" type="text/css" href="'.$CFG->wwwroot.'/question/type/textoprocesador/css/base.css"/>
         ');

		/* -ISE */

        if (!isset($this->question->options)){
					global $CFG;
	        global $DB;
            $OpVar ="";

			/*
				-IS
				BANDERAS PARA LA CARGA DEL Establecer simulador inicial Y SIULADOR RESULTADO
			*/
			$mform->addElement('text', 'initsim',"Datos BD simIni"); //textosAtto db field
			$mform->setType('initsim', PARAM_NOTAGS); //Set type of element
			$mform->setDefault('initsim', '');        //Default value

			$mform->addElement('text', 'resultsim',"Datos BD simRes"); //textosAtto db field
			$mform->setType('resultsim', PARAM_NOTAGS); //Set type of element
			$mform->setDefault('resultsim', '');        //Default value


			$mform->addElement('text', 'answprev',"Respuestas previas");
		    $mform->setType('answprev', PARAM_NOTAGS);   //Set type of element
		    $mform->setDefault('answprev', '');        //Default value


			//recuperar las respuestas para usarlas en el javaScript
			//$OpVar = $this->question->options->initsim;
			//$prevAnsw = $this->question->options->resultsim;

			//Primera forma
			$mform->addElement('editor', 'textosAtto1', get_string('prellenado', 'qtype_textoprocesador' ), array(
					'rows' => 20,
					'cols' => 10,
					// 'text' => $OpVar,
					'class' => 'mceEditor1'
					), $this->editoroptions);
			$mform->addRule('textosAtto1', "-", 'required', null, 'server');

			$mform->addElement('html','
							<div class="w100 center">
									<a href="#" id="bDuplica">Establecer simulador inicial</a>
							</div>
							<div class="w100" id="tmpJsonC">
                                				</div>
				');

			//Segunda forma
			$mform->addElement('editor', 'textosAtto2', get_string('tituloPrellenado', 'qtype_textoprocesador'), array(
					'rows' => 25,
					//'text' => $prevAnsw,
					'class' => 'mceEditor2'
				), $this->editoroptions);
			$mform->addRule('textosAtto2', "-", 'required', null, 'server');

			$mform->addElement('html','
					<div id="" class=" fitem">

						<div class="felement rAdded">
							<div id="formatCont" class="w100">
								<div class="w100">
									<!--p class="w30"><b>Descripción: </b></p-->
									<div class="w50">
										<p class="w30"><b>Calificación: </b></p>
										<select name="" id="answCal">
											<option value="1.0" selected="selected">100%</option>
											<option value="0.9">90%</option>
											<option value="0.8333333">83.33333%</option>
											<option value="0.8">80%</option>
											<option value="0.75">75%</option>
											<option value="0.7">70%</option>
											<option value="0.6666667">66.66667%</option>
											<option value="0.6">60%</option>
											<option value="0.5">50%</option>
											<option value="0.4">40%</option>
											<option value="0.3333333">33.33333%</option>
											<option value="0.3">30%</option>
											<option value="0.25">25%</option>
											<option value="0.2">20%</option>
											<option value="0.1666667">16.66667%</option>
											<option value="0.1428571">14.28571%</option>
											<option value="0.125">12.5%</option>
											<option value="0.1111111">11.11111%</option>
											<option value="0.1">10%</option>
											<option value="0.05">5%</option>
										</select>
									</div>
									<!--input class="w90" id="answDes" value="Sin descripción" type="text"-->
									<a href="#" id="bResult" class="w40">Guardar Respuesta</a>
									<br class="cBoth">
								</div>


								<div class="w100" id="prevAns">
									<!--p><b>Vista de respuestas previas</b></p-->
									<div id="" class="w100 hide contPrevAnsw textSim">

									</div>
								</div>


							</div>
						</div>
					</div>

				');
				$mform->addElement('html',$this->defaultsims());

		}
		else{
				global $CFG;
				global $DB;

				$prevAnsR = $this->question->options->answprev;
				$restPrev = $prevAnsR;
				$prevAnsR = str_replace("|-|", "<", $prevAnsR);

				$mform->addElement('html','
					<script type="text/javascript">

						var answerString = "";
						var answers;
						var initsim;
						var resultsim;
						var answPrev= \''.$restPrev.'\';
			            var prevAnsR = \''.$prevAnsR.'\';

						var rootDir = "'.$CFG->wwwroot.'";

						$(function(){

							$("#id_answprev")
								.text(answPrev)
								.attr("value",answPrev)
							;

							$(".contPrevAnsw.textSim").append(prevAnsR);

							//alert("Recuerda generar una nueva respuesta.");
							//Se carga las respuestas actuales
							inittextSim();
							restartAnsPre();
						});
					</script>
				');

				//recuperar las respuestas para usarlas en el javaScript
				$OpVar = $this->question->options->initsim;
				$prevAnsw = $this->question->options->resultsim;
				/*
				    echo "<h3>Initsim</h3>";
				    var_dump($OpVar);

				    echo "<h3>resultSim</h3>";
				    var_dump($prevAnsw);
				    echo "<hr><hr>";
				*/

				/*
					-IS
					BANDERAS PARA LA CARGA DEL Establecer simulador inicial Y SIULADOR RESULTADO
				*/
				$mform->addElement('text', 'initsim',"Datos DB simIni"); //textosAtto db field
				$mform->setType('initsim', PARAM_NOTAGS); //Set type of element
				$mform->setDefault('initsim', '');        //Default value

				$mform->addElement('text', 'resultsim',"Datos DB simRes"); //textosAtto db field
				$mform->setType('resultsim', PARAM_NOTAGS); //Set type of element
				$mform->setDefault('resultsim', '');        //Default value

				$mform->addElement('text', 'answprev',"Respuestas previas");
			    $mform->setType('answprev', PARAM_NOTAGS);   //Set type of element
			    $mform->setDefault('answprev', '');        //Default value

				//Primera forma
				$OpVar = str_replace("|-|", "<", $OpVar);
				$mform->addElement
				(
				   'editor',
				   'textosAtto1',
				   get_string('prellenado', 'qtype_textoprocesador'),
				   null,
				   array('context' => null)
				)->setValue( array('text' => $OpVar) );
				$mform->addElement('html','
								<div class="w100">
										<a href="#" id="bDuplica">Establecer simulador inicial</a>
								</div>
								<div class="w100" id="tmpJsonC">
			                                        </div>
					');

				//Segunda forma
				/*
				$mform->addElement('editor', 'textosAtto2', get_string('tituloPrellenado', 'qtype_textoprocesador'), array(
						'rows' => 25,
						'text' => $prevAnsw,
						'class' => 'mceEditor2'
					), $this->editoroptions);
				*/
				$prevAnsw = str_replace("|-|", "<", $prevAnsw);
				$mform->addElement
				(
				   'editor',
				   'textosAtto2',
				   get_string('tituloPrellenado', 'qtype_textoprocesador'),
				   null,
				   array('context' => null)
				)->setValue( array('text' => $prevAnsw) );

				$mform->addElement('html','
					<div id="" class=" fitem">

						<div class="felement rAdded">
							<div id="formatCont" class="w100">
								<div class="w100">
									<!--p class="w30"><b>Descripción: </b></p-->
									<div class="w50">
										<p class="w30"><b>Calificación: </b></p>
										<select name="" id="answCal">
											<option value="1.0" selected="selected">100%</option>
											<option value="0.9">90%</option>
											<option value="0.8333333">83.33333%</option>
											<option value="0.8">80%</option>
											<option value="0.75">75%</option>
											<option value="0.7">70%</option>
											<option value="0.6666667">66.66667%</option>
											<option value="0.6">60%</option>
											<option value="0.5">50%</option>
											<option value="0.4">40%</option>
											<option value="0.3333333">33.33333%</option>
											<option value="0.3">30%</option>
											<option value="0.25">25%</option>
											<option value="0.2">20%</option>
											<option value="0.1666667">16.66667%</option>
											<option value="0.1428571">14.28571%</option>
											<option value="0.125">12.5%</option>
											<option value="0.1111111">11.11111%</option>
											<option value="0.1">10%</option>
											<option value="0.05">5%</option>
										</select>
									</div>
									<!--input class="w90" id="answDes" value="Sin descripción" type="text"-->
									<a href="#" id="bResult" class="w40">Guardar Respuesta</a>
									<br class="cBoth">
								</div>


								<div class="w100" id="prevAns">
									<!--p><b>Vista de respuestas previas</b></p--!>
									<div id="" class="w100 hide contPrevAnsw textSim">

									</div>
								</div>


							</div>
						</div>
					</div>

				');
				$mform->addElement('html',$this->restartsims());

				}

        $mform->addElement('static', 'answersinstruct',
                get_string('correctanswers', 'qtype_textoprocesador'),
                get_string('filloutoneanswer', 'qtype_textoprocesador'));
        $mform->closeHeaderBefore('answersinstruct');

        $this->add_per_answer_fields($mform, get_string('answerno', 'qtype_textoprocesador', '{no}'),
				question_bank::fraction_options());

        $this->add_interactive_settings();
    }

	protected function get_more_choices_string() {

        return get_string('addmoreanswerblanks', 'qtype_textoprocesador');
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
                $errors["answeroptions[$key]"] = get_string('answermustbegiven', 'qtype_textoprocesador');
                $answercount++;
            }
        }
        if ($answercount==0) {
            $errors['answeroptions[0]'] = get_string('notenoughanswers', 'qtype_textoprocesador', 1);
        }
        if ($maxgrade == false) {
            $errors['answeroptions[0]'] = get_string('fractionsnomax', 'question');
        }
        return $errors;
    }

    public function qtype() {
        return 'textoprocesador';
    }
}
