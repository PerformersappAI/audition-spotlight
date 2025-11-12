import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, List, CheckCircle, XCircle } from 'lucide-react';
import { useAcademyCourses } from '@/hooks/useAcademyCourses';
import { useCourseQuizzes } from '@/hooks/useCourseQuizzes';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';

interface QuizFormData {
  course_id: string;
  title: string;
  description: string;
  passing_score: number;
  time_limit_minutes: number | null;
  max_attempts: number;
  is_required_for_certification: boolean;
  order_index: number;
}

interface QuestionFormData {
  question_text: string;
  question_type: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  points: number;
  order_index: number;
}

export default function AdminQuizzes() {
  const { data: courses } = useAcademyCourses({});
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const { data: quizzes, isLoading: quizzesLoading } = useCourseQuizzes(selectedCourseId);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);
  const [isQuestionDialogOpen, setIsQuestionDialogOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const queryClient = useQueryClient();

  const [quizForm, setQuizForm] = useState<QuizFormData>({
    course_id: '',
    title: '',
    description: '',
    passing_score: 70,
    time_limit_minutes: null,
    max_attempts: 3,
    is_required_for_certification: true,
    order_index: 0,
  });

  const [questionForm, setQuestionForm] = useState<QuestionFormData>({
    question_text: '',
    question_type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    points: 1,
    order_index: 0,
  });

  const [questions, setQuestions] = useState<any[]>([]);

  const loadQuestions = async (quizId: string) => {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index');
    
    if (!error && data) {
      setQuestions(data);
    }
  };

  const handleSaveQuiz = async () => {
    try {
      if (editingQuiz) {
        const { error } = await supabase
          .from('course_quizzes')
          .update(quizForm)
          .eq('id', editingQuiz.id);
        
        if (error) throw error;
        toast.success('Quiz updated successfully');
      } else {
        const { error } = await supabase
          .from('course_quizzes')
          .insert(quizForm);
        
        if (error) throw error;
        toast.success('Quiz created successfully');
      }
      
      queryClient.invalidateQueries({ queryKey: ['course-quizzes'] });
      setIsQuizDialogOpen(false);
      resetQuizForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save quiz');
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('Are you sure you want to delete this quiz? This will also delete all associated questions.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('course_quizzes')
        .delete()
        .eq('id', quizId);
      
      if (error) throw error;
      toast.success('Quiz deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['course-quizzes'] });
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete quiz');
    }
  };

  const handleSaveQuestion = async () => {
    try {
      if (editingQuestion) {
        const { error } = await supabase
          .from('quiz_questions')
          .update({
            ...questionForm,
            options: questionForm.options.filter(o => o.trim()),
          })
          .eq('id', editingQuestion.id);
        
        if (error) throw error;
        toast.success('Question updated successfully');
      } else {
        const { error } = await supabase
          .from('quiz_questions')
          .insert({
            quiz_id: selectedQuizId,
            ...questionForm,
            options: questionForm.options.filter(o => o.trim()),
          });
        
        if (error) throw error;
        toast.success('Question added successfully');
      }
      
      loadQuestions(selectedQuizId);
      setIsQuestionDialogOpen(false);
      resetQuestionForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save question');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', questionId);
      
      if (error) throw error;
      toast.success('Question deleted successfully');
      loadQuestions(selectedQuizId);
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete question');
    }
  };

  const resetQuizForm = () => {
    setQuizForm({
      course_id: selectedCourseId,
      title: '',
      description: '',
      passing_score: 70,
      time_limit_minutes: null,
      max_attempts: 3,
      is_required_for_certification: true,
      order_index: 0,
    });
    setEditingQuiz(null);
  };

  const resetQuestionForm = () => {
    setQuestionForm({
      question_text: '',
      question_type: 'multiple_choice',
      options: ['', '', '', ''],
      correct_answer: '',
      explanation: '',
      points: 1,
      order_index: 0,
    });
    setEditingQuestion(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Quiz Management</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage course quizzes and questions
          </p>
        </div>

        {/* Course Selector */}
        <Card>
          <CardHeader>
            <CardTitle>Select Course</CardTitle>
            <CardDescription>Choose a course to manage its quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses?.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedCourseId && (
          <>
            {/* Quizzes List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Course Quizzes</CardTitle>
                    <CardDescription>
                      {quizzes?.length || 0} quiz(es) configured
                    </CardDescription>
                  </div>
                  <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
                    <DialogTrigger asChild>
                      <Button onClick={() => {
                        resetQuizForm();
                        setQuizForm(prev => ({ ...prev, course_id: selectedCourseId }));
                      }}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Quiz
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>
                          {editingQuiz ? 'Edit Quiz' : 'Create New Quiz'}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Title</Label>
                          <Input
                            value={quizForm.title}
                            onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                            placeholder="Quiz title"
                          />
                        </div>
                        <div>
                          <Label>Description</Label>
                          <Textarea
                            value={quizForm.description}
                            onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                            placeholder="Quiz description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Passing Score (%)</Label>
                            <Input
                              type="number"
                              value={quizForm.passing_score}
                              onChange={(e) => setQuizForm({ ...quizForm, passing_score: parseInt(e.target.value) })}
                              min="0"
                              max="100"
                            />
                          </div>
                          <div>
                            <Label>Time Limit (minutes)</Label>
                            <Input
                              type="number"
                              value={quizForm.time_limit_minutes || ''}
                              onChange={(e) => setQuizForm({ ...quizForm, time_limit_minutes: e.target.value ? parseInt(e.target.value) : null })}
                              placeholder="No limit"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Max Attempts</Label>
                            <Input
                              type="number"
                              value={quizForm.max_attempts}
                              onChange={(e) => setQuizForm({ ...quizForm, max_attempts: parseInt(e.target.value) })}
                              min="1"
                            />
                          </div>
                          <div>
                            <Label>Order Index</Label>
                            <Input
                              type="number"
                              value={quizForm.order_index}
                              onChange={(e) => setQuizForm({ ...quizForm, order_index: parseInt(e.target.value) })}
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={quizForm.is_required_for_certification}
                            onCheckedChange={(checked) => setQuizForm({ ...quizForm, is_required_for_certification: checked })}
                          />
                          <Label>Required for Certification</Label>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setIsQuizDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleSaveQuiz}>
                            {editingQuiz ? 'Update' : 'Create'} Quiz
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {quizzesLoading ? (
                  <div className="text-center py-8 text-muted-foreground">Loading...</div>
                ) : quizzes && quizzes.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Passing Score</TableHead>
                        <TableHead>Time Limit</TableHead>
                        <TableHead>Max Attempts</TableHead>
                        <TableHead>Required</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quizzes.map((quiz) => (
                        <TableRow key={quiz.id}>
                          <TableCell className="font-medium">{quiz.title}</TableCell>
                          <TableCell>{quiz.passing_score}%</TableCell>
                          <TableCell>{quiz.time_limit_minutes ? `${quiz.time_limit_minutes} min` : 'No limit'}</TableCell>
                          <TableCell>{quiz.max_attempts}</TableCell>
                          <TableCell>
                            {quiz.is_required_for_certification ? (
                              <Badge variant="default">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Yes
                              </Badge>
                            ) : (
                              <Badge variant="secondary">
                                <XCircle className="h-3 w-3 mr-1" />
                                No
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedQuizId(quiz.id);
                                  loadQuestions(quiz.id);
                                }}
                              >
                                <List className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingQuiz(quiz);
                                  setQuizForm({
                                    course_id: quiz.course_id,
                                    title: quiz.title,
                                    description: quiz.description || '',
                                    passing_score: quiz.passing_score,
                                    time_limit_minutes: quiz.time_limit_minutes,
                                    max_attempts: quiz.max_attempts,
                                    is_required_for_certification: quiz.is_required_for_certification,
                                    order_index: quiz.order_index,
                                  });
                                  setIsQuizDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteQuiz(quiz.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No quizzes created yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Questions Management */}
            {selectedQuizId && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Quiz Questions</CardTitle>
                      <CardDescription>
                        {questions.length} question(s)
                      </CardDescription>
                    </div>
                    <Dialog open={isQuestionDialogOpen} onOpenChange={setIsQuestionDialogOpen}>
                      <DialogTrigger asChild>
                        <Button onClick={resetQuestionForm}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Question
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>
                            {editingQuestion ? 'Edit Question' : 'Add New Question'}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Question Text</Label>
                            <Textarea
                              value={questionForm.question_text}
                              onChange={(e) => setQuestionForm({ ...questionForm, question_text: e.target.value })}
                              placeholder="Enter the question"
                            />
                          </div>
                          <div>
                            <Label>Question Type</Label>
                            <Select
                              value={questionForm.question_type}
                              onValueChange={(value) => setQuestionForm({ ...questionForm, question_type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                <SelectItem value="true_false">True/False</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Answer Options</Label>
                            {questionForm.options.map((option, index) => (
                              <Input
                                key={index}
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...questionForm.options];
                                  newOptions[index] = e.target.value;
                                  setQuestionForm({ ...questionForm, options: newOptions });
                                }}
                                placeholder={`Option ${index + 1}`}
                                className="mt-2"
                              />
                            ))}
                          </div>
                          <div>
                            <Label>Correct Answer</Label>
                            <Input
                              value={questionForm.correct_answer}
                              onChange={(e) => setQuestionForm({ ...questionForm, correct_answer: e.target.value })}
                              placeholder="Enter the correct answer exactly as written above"
                            />
                          </div>
                          <div>
                            <Label>Explanation (Optional)</Label>
                            <Textarea
                              value={questionForm.explanation}
                              onChange={(e) => setQuestionForm({ ...questionForm, explanation: e.target.value })}
                              placeholder="Explain why this is the correct answer"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Points</Label>
                              <Input
                                type="number"
                                value={questionForm.points}
                                onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) })}
                                min="1"
                              />
                            </div>
                            <div>
                              <Label>Order Index</Label>
                              <Input
                                type="number"
                                value={questionForm.order_index}
                                onChange={(e) => setQuestionForm({ ...questionForm, order_index: parseInt(e.target.value) })}
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsQuestionDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleSaveQuestion}>
                              {editingQuestion ? 'Update' : 'Add'} Question
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {questions.length > 0 ? (
                    <div className="space-y-4">
                      {questions.map((question, index) => (
                        <Card key={question.id}>
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-base">
                                  Question {index + 1}
                                </CardTitle>
                                <p className="text-sm mt-2">{question.question_text}</p>
                                <div className="mt-4 space-y-1">
                                  {question.options.map((option: string, optIndex: number) => (
                                    <div
                                      key={optIndex}
                                      className={`text-sm p-2 rounded ${
                                        option === question.correct_answer
                                          ? 'bg-primary/10 text-primary font-medium'
                                          : 'bg-muted'
                                      }`}
                                    >
                                      {option}
                                      {option === question.correct_answer && ' ✓'}
                                    </div>
                                  ))}
                                </div>
                                {question.explanation && (
                                  <p className="text-sm text-muted-foreground mt-2">
                                    Explanation: {question.explanation}
                                  </p>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <Badge variant="secondary">{question.points} pts</Badge>
                                  <Badge variant="outline">{question.question_type}</Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingQuestion(question);
                                    setQuestionForm({
                                      question_text: question.question_text,
                                      question_type: question.question_type,
                                      options: question.options,
                                      correct_answer: question.correct_answer,
                                      explanation: question.explanation || '',
                                      points: question.points,
                                      order_index: question.order_index,
                                    });
                                    setIsQuestionDialogOpen(true);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteQuestion(question.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No questions added yet
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
}
