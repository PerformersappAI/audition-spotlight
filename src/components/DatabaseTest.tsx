import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const DatabaseTest = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testDatabaseTables = async () => {
    setTestResults([]);
    addResult('Starting database tests...');

    if (!user) {
      addResult('❌ No user found - please log in first');
      return;
    }

    addResult(`✅ User found: ${user.id}`);

    // Test 1: Check if posts table exists
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('count')
        .limit(1);

      if (error) {
        addResult(`❌ Posts table error: ${error.message}`);
      } else {
        addResult('✅ Posts table exists');
      }
    } catch (err) {
      addResult(`❌ Posts table test failed: ${err}`);
    }

    // Test 2: Check if likes table exists
    try {
      const { data, error } = await supabase
        .from('likes')
        .select('count')
        .limit(1);

      if (error) {
        addResult(`❌ Likes table error: ${error.message}`);
      } else {
        addResult('✅ Likes table exists');
      }
    } catch (err) {
      addResult(`❌ Likes table test failed: ${err}`);
    }

    // Test 3: Check if follows table exists
    try {
      const { data, error } = await supabase
        .from('follows')
        .select('count')
        .limit(1);

      if (error) {
        addResult(`❌ Follows table error: ${error.message}`);
      } else {
        addResult('✅ Follows table exists');
      }
    } catch (err) {
      addResult(`❌ Follows table test failed: ${err}`);
    }

    // Test 4: Check if comments table exists
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('count')
        .limit(1);

      if (error) {
        addResult(`❌ Comments table error: ${error.message}`);
      } else {
        addResult('✅ Comments table exists');
      }
    } catch (err) {
      addResult(`❌ Comments table test failed: ${err}`);
    }

    // Test 5: Check user profile
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .eq('user_id', user.id)
        .single();

      if (error) {
        addResult(`❌ Profile error: ${error.message}`);
      } else {
        addResult(`✅ Profile found: ${profile.id} (${profile.first_name} ${profile.last_name})`);
      }
    } catch (err) {
      addResult(`❌ Profile test failed: ${err}`);
    }

    // Test 6: Try to create a test post
    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: 'Test post for database verification',
          post_type: 'text',
          is_public: true
        })
        .select()
        .single();

      if (error) {
        addResult(`❌ Create post error: ${error.message}`);
      } else {
        addResult(`✅ Test post created: ${data.id}`);
        
        // Clean up test post
        await supabase.from('posts').delete().eq('id', data.id);
        addResult('✅ Test post cleaned up');
      }
    } catch (err) {
      addResult(`❌ Create post test failed: ${err}`);
    }

    addResult('Database tests completed!');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Database Connection Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={testDatabaseTables} className="w-full">
          Test Database Tables
        </Button>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {testResults.map((result, index) => (
            <div 
              key={index} 
              className={`text-sm p-2 rounded ${
                result.includes('❌') ? 'bg-red-100 text-red-800' : 
                result.includes('✅') ? 'bg-green-100 text-green-800' : 
                'bg-gray-100 text-gray-800'
              }`}
            >
              {result}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};




