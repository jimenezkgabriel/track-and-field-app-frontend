import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const EventItem = ({ record, description, createdAt, updatedAt, onEdit, onDelete }) => {
	const createdLabel = createdAt ? new Date(createdAt).toLocaleString() : null;
	const editedLabel = updatedAt ? new Date(updatedAt).toLocaleString() : null;
	const showEdited = Boolean(createdAt && updatedAt && updatedAt !== createdAt);
	const showActions = Boolean(onEdit || onDelete);

	return (
		<Paper
			elevation={3}
			sx={{
				p: 2,
				display: 'flex',
				flexDirection: 'column',
				gap: 1.5,
                borderRadius: 8,
			}}
		>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={2}
				sx={{ alignItems: { sm: 'center' }, justifyContent: 'space-between' }}
			>
				<Stack spacing={0.5} sx={{ minWidth: 0 }}>
					<Typography variant="h6" component="h3">
						Record: {record}
					</Typography>
					{description && (
						<Typography variant="body2" color="text.secondary">
							{description}
						</Typography>
					)}
					{(createdLabel || editedLabel) && (
						<Typography variant="caption" color="text.secondary">
							{createdLabel && `Created: ${createdLabel}`}
							{showEdited ? ` • Edited: ${editedLabel}` : ''}
						</Typography>
					)}
				</Stack>
			{showActions && (
				<Stack
					direction="row"
					spacing={1}
					sx={{ flexShrink: 0, justifyContent: { xs: 'space-between', sm: 'auto' } }}
				>
					<Button variant="outlined" onClick={onEdit} disabled={!onEdit} sx={{ borderRadius: 4 }}>
						Edit
					</Button>
					<Button variant="contained" color="error" onClick={onDelete} disabled={!onDelete} sx={{ borderRadius: 4 }}>
						Delete
					</Button>
				</Stack>
			)}
			</Stack>
		</Paper>
	);
};

export default EventItem;