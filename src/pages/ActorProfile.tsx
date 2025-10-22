import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, 
  MapPin, 
  Calendar, 
  Award, 
  Briefcase, 
  Camera,
  Save,
  Edit3,
  X
} from "lucide-react";

const ActorProfile = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    location: '',
    age_range: '',
    union_status: 'Non-Union',
    skills: '',
    headshot_url: '',
    resume_url: '',
    showreel_url: ''
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        first_name: userProfile.first_name || '',
        last_name: userProfile.last_name || '',
        bio: userProfile.bio || '',
        location: userProfile.location || '',
        age_range: userProfile.age_range || '',
        union_status: userProfile.union_status || 'Non-Union',
        skills: userProfile.skills || '',
        headshot_url: userProfile.headshot_url || '',
        resume_url: userProfile.resume_url || '',
        showreel_url: userProfile.showreel_url || ''
      });
    }
  }, [userProfile]);

  const handleSave = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio,
          location: formData.location,
          age_range: formData.age_range,
          union_status: formData.union_status,
          skills: formData.skills,
          headshot_url: formData.headshot_url,
          resume_url: formData.resume_url,
          showreel_url: formData.showreel_url,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    const first = formData.first_name?.[0] || '';
    const last = formData.last_name?.[0] || '';
    return `${first}${last}`.toUpperCase() || 'AN';
  };

  return (
    <Layout userRole="ACTOR">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Actor Profile</h1>
              <p className="text-muted-foreground">Manage your professional profile and portfolio</p>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    variant="gold"
                    className="flex items-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="flex justify-center mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={formData.headshot_url} />
                      <AvatarFallback className="text-2xl">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl">
                    {formData.first_name && formData.last_name 
                      ? `${formData.first_name} ${formData.last_name}`
                      : 'Actor Name'
                    }
                  </CardTitle>
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge variant="secondary">
                      {formData.union_status}
                    </Badge>
                    {formData.age_range && (
                      <Badge variant="outline">
                        {formData.age_range}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {formData.location && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {formData.location}
                    </div>
                  )}
                  {formData.skills && (
                    <div>
                      <Label className="text-sm font-medium">Skills</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.skills}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">First Name</Label>
                      {isEditing ? (
                        <Input
                          id="first_name"
                          value={formData.first_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, first_name: e.target.value }))}
                          placeholder="Enter your first name"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {formData.first_name || 'Not provided'}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="last_name">Last Name</Label>
                      {isEditing ? (
                        <Input
                          id="last_name"
                          value={formData.last_name}
                          onChange={(e) => setFormData(prev => ({ ...prev, last_name: e.target.value }))}
                          placeholder="Enter your last name"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {formData.last_name || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Tell us about yourself..."
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      {isEditing ? (
                        <Input
                          id="location"
                          value={formData.location}
                          onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                          placeholder="City, State"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {formData.location || 'Not provided'}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="age_range">Age Range</Label>
                      {isEditing ? (
                        <Input
                          id="age_range"
                          value={formData.age_range}
                          onChange={(e) => setFormData(prev => ({ ...prev, age_range: e.target.value }))}
                          placeholder="e.g., 25-35"
                        />
                      ) : (
                        <p className="text-sm text-muted-foreground mt-1">
                          {formData.age_range || 'Not provided'}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="union_status">Union Status</Label>
                    {isEditing ? (
                      <select
                        id="union_status"
                        value={formData.union_status}
                        onChange={(e) => setFormData(prev => ({ ...prev, union_status: e.target.value }))}
                        className="w-full px-3 py-2 border border-input rounded-md bg-background"
                      >
                        <option value="Non-Union">Non-Union</option>
                        <option value="SAG-AFTRA">SAG-AFTRA</option>
                        <option value="AEA">AEA</option>
                        <option value="SAG-AFTRA Eligible">SAG-AFTRA Eligible</option>
                      </select>
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.union_status}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    {isEditing ? (
                      <Input
                        id="skills"
                        value={formData.skills}
                        onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                        placeholder="e.g., Stage Combat, Dance, Singing"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.skills || 'No skills listed'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Portfolio */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Portfolio
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="headshot_url">Headshot URL</Label>
                    {isEditing ? (
                      <Input
                        id="headshot_url"
                        value={formData.headshot_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, headshot_url: e.target.value }))}
                        placeholder="https://example.com/headshot.jpg"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.headshot_url || 'No headshot uploaded'}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="resume_url">Resume URL</Label>
                    {isEditing ? (
                      <Input
                        id="resume_url"
                        value={formData.resume_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, resume_url: e.target.value }))}
                        placeholder="https://example.com/resume.pdf"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.resume_url || 'No resume uploaded'}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="showreel_url">Showreel URL</Label>
                    {isEditing ? (
                      <Input
                        id="showreel_url"
                        value={formData.showreel_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, showreel_url: e.target.value }))}
                        placeholder="https://example.com/showreel.mp4"
                      />
                    ) : (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.showreel_url || 'No showreel uploaded'}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ActorProfile;
