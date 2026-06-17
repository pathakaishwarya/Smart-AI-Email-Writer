import { useState } from 'react'
import './App.css'
import { Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Box, Button, CircularProgress } from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false); // Added for better UX

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setGeneratedReply(''); // Clear previous reply on new submit
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant='h3' component="h1" gutterBottom>
        Email Reply Generator
      </Typography>
      
      <Box sx={{ mx: 3 }}>
        <TextField
          fullWidth 
          multiline
          rows={6} 
          variant='outlined'
          label="Original Email Content"
          value={emailContent || ''}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select
            value={tone || ''}
            label="Tone (Optional)"
            onChange={(e) => setTone(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
          </Select>    
        </FormControl>

        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={!emailContent || loading}
          fullWidth
          sx={{ mb: 2 }} // Added spacing below button
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
        </Button>

        {/* Moved Error inside the Box for consistent alignment */}
        {error && (
          <Typography color='error' sx={{ mt: 1, mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Kept Result inside the Box for consistent alignment */}
        {generatedReply && (
          <Box sx={{ mt: 3 }}>
            <Typography variant='h6' gutterBottom>
              Generated Reply:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              variant='outlined'
              value={generatedReply || ''}
              InputProps={{ readOnly: true }} // Capital "I" for standard MUI read-only implementation
            />
            <Button 
              variant='outlined'
              sx={{ mt: 2 }}
              onClick={handleCopy}
              color={copied ? "success" : "primary"} // Turns green when copied!
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default App